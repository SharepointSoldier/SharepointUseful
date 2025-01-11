(function(webapi, $) {
    function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();

        shell.getTokenDeferred().done(function(token) {
            if (!ajaxOptions.headers) {
                $.extend(ajaxOptions, {
                    headers: {
                        "__RequestVerificationToken": token
                    }
                });
            } else {
                ajaxOptions.headers["__RequestVerificationToken"] = token;
            }
            $.ajax(ajaxOptions)
                .done(function(data, textStatus, jqXHR) {
                    validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                }).fail(function(xhr, status, error) {
                    deferredAjax.reject(xhr, status, error);
                });
        }).fail(function(xhr, status, error) {
            deferredAjax.reject(xhr, status, error);
        });

        return deferredAjax.promise();
    }
    webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery);

$(document).ready(function() {
   
    $('#createButton').click(function() {
        const firstname = $('#createName').val();
        const age = $('#createAge').val();
        const email = $('#createEmail').val();
        const phone = $('#createPhoneNumber').val();
        const file = $('#createFile')[0].files[0];

        if (firstname && age && email && phone) {
            const data = {
                "cr935_name": firstname,
                "cr935_age": age,
                "cr935_email": email,
                "cr935_phonenumber": phone
            };

            webapi.safeAjax({
                url: '/_api/cr935_crudemps', // Make sure this URL is correct
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).done(function(response, textStatus, xhr) {
                if (response && response.entityid) {
                    var entityID = response.entityid; // Assuming the response contains the entity ID
                    if (file) {
                        uploadAttachment(entityID, file);
                    } else {
                        alert('Entity created successfully, no file to upload');
                        readData();
                    }
                } else {
                    console.error('Error: Entity ID not found in response');
                }
            }).fail(function(xhr, status, error) {
                console.error('Error:', error);
            });
        } else {
            alert('Please fill in all fields');
        }
    });

    function uploadAttachment(entityID, file) {
        var formData = new FormData();
        formData.append('file', file, file.name);

        webapi.safeAjax({
            url: `/_api/cr935_crudemps(${entityID})/Attachment`, // Correct URL to handle file attachments
            method: 'POST',
            contentType: false, // Let jQuery set the correct content type
            processData: false, // Prevent jQuery from processing the data
            data: formData
        }).done(function(response) {
            alert('Attachment upload successful');
            readData();
        }).fail(function(xhr, status, error) {
            console.error('Error:', error);
        });
    }

    // Read operation
    function readData() {
        webapi.safeAjax({
            url: '/_api/cr935_crudemps',
            method: 'GET',
            contentType: 'application/json'
        }).done(function(response) {
            if (Array.isArray(response.value)) {
                let results = '';
                response.value.forEach(function(item) {
                    results += `<tr data-id="${item.cr935_crudempid}">
                        <td>${item.cr935_crudempid}</td>
                        <td class="editable" data-field="cr935_name">${item.cr935_name}</td>
                        <td class="editable" data-field="cr935_age">${item.cr935_age}</td>
                        <td class="editable" data-field="cr935_email">${item.cr935_email}</td>
                        <td class="editable" data-field="cr935_phonenumber">${item.cr935_phonenumber}</td>
                        <td id="cr935_attachment_${item.cr935_crudempid}"></td>
                        <td>
                            <button class="btn btn-sm btn-warning editButton">Edit</button>
                            <button class="btn btn-sm btn-primary saveButton" style="display: none;">Save</button>
                            <button class="btn btn-sm btn-danger deleteButton">Delete</button>
                        </td>
                    </tr>`;
                });
                $('#readResults tbody').html(results);
                // Load attachments
                loadAttachments(response.value);
            } else {
                console.error('Response is not an array:', response);
            }
        }).fail(function(xhr, status, error) {
            console.error('Error:', error);
        });
    }

    function loadAttachments(records) {
        records.forEach(function(item) {
            webapi.safeAjax({
                url: `/_api/cr935_crudemps(${item.cr935_crudempid})/Microsoft.Dynamics.CRM.cr935_crudemp_cr935_crudemp_Attachments`,
                method: 'GET',
                contentType: 'application/json'
            }).done(function(response) {
                const attachmentCell = $(`#cr935_attachment_${item.cr935_crudempid}`);
                if (response && response.value && response.value.length > 0) {
                    const attachmentLinks = response.value.map(attachment => {
                        return `<a href="${attachment.url}" target="_blank">${attachment.name}</a>`;
                    }).join(', ');
                    attachmentCell.html(attachmentLinks);
                } else {
                    attachmentCell.html('No attachments');
                }
            }).fail(function(xhr, status, error) {
                console.error('Error:', error);
            });
        });
    }

    // Edit operation
    $(document).on('click', '.editButton', function() {
        const row = $(this).closest('tr');
        row.find('.editable').each(function() {
            const field = $(this).data('field');
            const value = $(this).text();
            $(this).html(`<input type="text" class="form-control" data-field="${field}" value="${value}">`);
        });
        row.find('.editButton').hide();
        row.find('.saveButton').show();
    });

    // Save operation
    $(document).on('click', '.saveButton', function() {
        const row = $(this).closest('tr');
        const id = row.data('id');
        const data = {};

        row.find('input').each(function() {
            const field = $(this).data('field');
            const value = $(this).val();
            data[field] = value;
        });

        webapi.safeAjax({
            url: `/_api/cr935_crudemps(${id})`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(function(response) {
            alert('Update successful');
            readData();
        }).fail(function(xhr, status, error) {
            console.error('Error:', error);
        });
    });
    
    // Delete operation
    $(document).on('click', '.deleteButton', function() {
        const row = $(this).closest('tr');
        const id = row.data('id');
        if(id) {
            webapi.safeAjax({
                url: `/_api/cr935_crudemps(${id})`,
                method: 'DELETE'
            }).done(function(response) {
                alert('Delete successful');
                readData();
            }).fail(function(xhr, status, error) {
                console.error('Error:', error);
            });
        } else {
            alert('Please provide an ID');
        }
    });

    // Initial read data
    readData();
});
