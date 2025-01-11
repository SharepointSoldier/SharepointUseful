const varUserContactID = '{{user.id}}';
console.log(varUserContactID);

$(document).ready(function () {
    console.log("Initializing DataTable...");

    $('.btnView').on('click', function () {
        $('.task-name').val($(this).data('taskname'));
        $('.start-date').val($(this).data('startdate'));
        $('.end-date').val($(this).data('enddate'));
       
        $('.estimated-hours').val($(this).data('estimatedhours'));
        $('.amount').val($(this).data('amount'));
        $('.assignedemployee').val($(this).data('employeename'));
        const approvedDate = $(this).data('approveddate');
        const rejectedDate = $(this).data('rejecteddate');
        const releasedDate = $(this).data('releaseddate');

        let statusHtml = '';

        if (approvedDate) {
            statusHtml += `
                <span style="background-color: #28a745; color: #fff; padding: 6px 10px; font-size: 14px; border-radius: 5px; margin-right: 10px; display: inline-block;">
                     Approved: <strong>${approvedDate}</strong>
                </span>
            `;
        }
    
        // Add released date if available
        if (releasedDate) {
            statusHtml += `
                <span style="background-color: #17a2b8; color: #fff; padding: 6px 10px; font-size: 14px; border-radius: 5px; margin-right: 10px; display: inline-block;">
                     Released: <strong>${releasedDate}</strong>
                </span>
            `;
        }
    
        // Add rejected date if available
        if (rejectedDate) {
            statusHtml += `
                <span style="background-color: #dc3545; color: #fff; padding: 6px 10px; font-size: 14px; border-radius: 5px; display: inline-block;">
                     Rejected: <strong>${rejectedDate}</strong>
                </span>
            `;
        }
        // Inject the built HTML into the container
        $('#status-container').html(statusHtml);
        // Open the sidebar
        $('#right-sidebar').addClass('sidebar-open');
    });

    // Handle sidebar close button click
    $('#sidebar-close').on('click', function () {
        // Close the sidebar
        $('#right-sidebar').removeClass('sidebar-open');
    });

    $('.example2').DataTable({
        "columnDefs" : [
            {"targets": 1, "type": "date-eu"},  // For Start Date column
            {"targets": 2, "type": "date-eu"}   // For End Date column
        ],
       
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp",
        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        buttons: [
            { 
                extend: 'csv', 
                title: 'dataKudosHub', 
                className: 'btn-sm',
                exportOptions: {
                    columns: [0, 1, 2, 3, 5] // Include Task Name, Start Date, End Date, Estimated Hours, and Amount
                }
            },
            { 
                extend: 'pdf', 
                title: 'dataKudosHub', 
                className: 'btn-sm',
                exportOptions: {
                    columns: [0, 1, 2, 3, 5] // Include Task Name, Start Date, End Date, Estimated Hours, and Amount
                },
                customize: function (doc) {
                    // Optional: Customize the PDF layout
                    doc.content[1].table.widths = ['20%', '20%', '20%', '20%', '20%']; // Adjust column widths
                    doc.styles.tableHeader.alignment = 'left'; // Align headers left
                }
            },
            { 
                extend: 'print', 
                className: 'btn-sm',
                exportOptions: {
                    columns: [0, 1, 2, 3, 5] // Include Task Name, Start Date, End Date, Estimated Hours, and Amount
                }
            }
        ]
    });

    $('[data-bs-toggle="tooltip"]').tooltip();

    $('.btnDelete').on('click', function () {
        const taskId = $(this).data('taskid');
        deleteTask(taskId);
    });

    $('.btnEdit').on('click', function () {
        const taskId = $(this).data('taskid');
        window.location.href = '/TaskSubmission?taskid=' + taskId;
    });

    //getReleasedAmount();
});

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTaskRecord(taskId);
    }
}

function populateFormForEdit(taskId) {
    webapi.safeAjax({
        type: "GET",
        url: "/_api/cr2e0_tasksubmissionses(" + taskId + ")",
        success: function (data) {
            $('#task-name').val(data.cr2e0_name);
            $('#start-date').val(data.cr2e0_startdate);
            $('#end-date').val(data.cr2e0_enddate);
            $('#estimated-hours').val(data.cr2e0_estimatedhours);
            $('#emptype').val(data.cr2e0_approvedby);
            $('#task-id').val(taskId);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching task record for edit: " + error);
        }
    });
}

function deleteTaskRecord(taskId) {
    webapi.safeAjax({
        type: "DELETE",
        url: `/_api/cr2e0_tasksubmissionses(${taskId})`,
        success: function (res, status, xhr) {
            console.log("Task deleted successfully");
            location.reload(); 
        },
        error: function (xhr, status, error) {
            console.error("Error deleting task: " + error);
            if (xhr.responseJSON) {
                console.error("Detailed error: ", xhr.responseJSON);
            }
        }
    });
}

function reviewRecord(recordId) {
    window.location = "/TaskApproval?r_id=" + recordId;
}

function viewRecord(recordId) {
    window.location = "/TaskSubmission?r_id=" + recordId;
}

function newProject() {
    window.location = "/TaskSubmission";
}

// Function getReleasedAmount and getTotalTaskAndAmount can be updated similarly

// function getReleasedAmount() {
//     webapi.safeAjax({
//         type: "GET",
//         url: "/_api/cr2e0_employeepayoutses?$filter=_cr2e0_employee_value eq " + varUserContactID,
//         success: function (data, textStatus, xhr) {
//             var results = data;
//             var totalSum = 0;
//             var previousMonthSum = 0;

//             var today = new Date();
//             var currentMonth = today.getMonth(); 
//             var currentYear = today.getFullYear();

//             var previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//             var previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

//             console.log(results);

//             for (var i = 0; i < results.value.length; i++) {
//                 var result = results.value[i];
                
//                 var totalAmount = result["cr2e0_releasedamount"];
//                 totalSum += totalAmount;

//                 var releaseDate = new Date(result["cr2e0_releaseddate"]);
//                 var releaseMonth = releaseDate.getMonth();
//                 var releaseYear = releaseDate.getFullYear();

//                 if (releaseMonth === previousMonth && releaseYear === previousMonthYear) {
//                     previousMonthSum += totalAmount;
//                 }
//             }
//             var totalReleasedAmount = totalSum;

//             //$(".widget-released-amount .releasedamount-value").text(`$${totalSum}`);
//             $(".widget-previousmonth-amount .previous-month-value").text(`$${previousMonthSum}`);

//             console.log("Total Sum: " + totalSum);
//             console.log("Previous Month Sum: " + previousMonthSum);
//             getTotalTaskAndAmount(totalReleasedAmount);

//         },
//         error: function (xhr, textStatus, errorThrown) {
//             console.log(xhr);
//         }
//     });
// }

// function getTotalTaskAndAmount(totalReleasedAmount) {
//     webapi.safeAjax({
//         type: "GET",
//         url: "/_api/cr2e0_employeetaskrecordses?$filter=_cr2e0_employee_value eq " + varUserContactID,
//         success: function (data, textStatus, xhr) {
//             var results = data;
//             var totalamount = 0;
//             var totalTaskEmpArray = []; 
          

//             console.log(results);
//             for (var i = 0; i < results.value.length; i++) {
//                 var result = results.value[i];
//                 var taskamount = result["cr2e0_amount"];
//                 totalamount += taskamount;

//                 var taskID = result["_cr2e0_taskid_value@OData.Community.Display.V1.FormattedValue"];
//                 totalTaskEmpArray.push(taskID); 
//             }
//             var remainingAmount = parseFloat((totalamount - totalReleasedAmount).toFixed(2));
//             //$(".widget-total-amount .amount-value").text(`$${remainingAmount}`);
//             //$(".widget-total-task .totaltask-value").text(totalTaskEmpArray.length);
//             console.log(totalTaskEmpArray.length); 


        
        
//             $('.totaltask-value').text(totalCount);


//         },
//         error: function (xhr, textStatus, errorThrown) {
//             console.log(xhr);
//         }
//     });
// }
