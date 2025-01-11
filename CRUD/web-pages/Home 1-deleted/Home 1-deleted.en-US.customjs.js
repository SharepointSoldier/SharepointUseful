(function(webapi, $){
  function safeAjax(ajaxOptions) {
    var deferredAjax = $.Deferred();

    shell.getTokenDeferred().done(function (token) {
      if (!ajaxOptions.headers) {
        ajaxOptions.headers = {
          "__RequestVerificationToken": token
        };
      } else {
        ajaxOptions.headers["__RequestVerificationToken"] = token;
      }

      $.ajax(ajaxOptions)
        .done(function(data, textStatus, jqXHR) {
          validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status === 400) {
            console.error("400 Bad Request:", jqXHR.responseText);
          } else {
            console.error("Error:", textStatus, errorThrown);
            deferredAjax.reject(jqXHR, textStatus, errorThrown);
          }
        });
    }).fail(function () {
      deferredAjax.rejectWith(this, arguments);
    });

    return deferredAjax.promise();	
  }
  webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery);

function fetchDataAndDisplay() {
  webapi.safeAjax({
    type: "GET",
    url: "/_api/cr935_crudemps",
    contentType: "application/json",
    success: function (data) {
      console.log("Data received:", data);
      if (Array.isArray(data)) {
        displayDataInTable(data);
      } else if (data && data.value && Array.isArray(data.value)) {
        displayDataInTable(data.value);
      } else {
        console.error("Unable to parse data:", data);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error:", textStatus, errorThrown);
    }
  });
}

function displayDataInTable(data) {
  var table = document.getElementById("employeeTable");
  if (!table) {
    console.error("Table element not found");
    return;
  }

  table.innerHTML = "";

  var headers = "<tr><th>Name</th><th>Email</th><th>File</th><th>Action</th></tr>";
  table.insertAdjacentHTML("beforeend", headers);

  data.forEach(function (employee) {
    var row = "<tr><td>" + employee.cr935_name + "</td><td>" + employee.cr935_email + "</td><td>" + (employee.cr935_fileattachment ? "<a href='" + employee.cr935_fileattachment + "'>Download</a>" : "No file") + "</td></tr>";
    table.insertAdjacentHTML("beforeend", row);
  });
}

fetchDataAndDisplay();


//crete

document.getElementById('addBtn').addEventListener('click', function(event) {
  event.preventDefault();

  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var file = document.getElementById('file').files[0];

  if (name && email && file) {
    var formData = new FormData();
    formData.append("cr935_name", name);
    formData.append("cr935_email", email);
    formData.append("cr935_fileattachment", file);

    webapi.safeAjax({
      type: "POST",
      url: "/_api/cr935_crudemps",
    //  processData: false,
      //contentType: false,
      data: formData,
      success: function (res, status, xhr) {
        console.log("entityID: " + xhr.getResponseHeader("entityid"));
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('file').value = '';
        fetchDataAndDisplay(); 
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        alert("Failed to add employee. Please try again.");
      }
    });
  } else {
    alert('Please provide name, email, and file.');
  }
});

// function updateEmployee(employeeId, updatedData) {
//   webapi.safeAjax({
//     type: "PATCH",
//     url: "/_api/cr935_crudemps/" + employeeId,
//     contentType: "application/json",
//     data: JSON.stringify(updatedData),
//     success: function (res) {
//       console.log("Employee updated:", res);
//       fetchDataAndDisplay(); // Refresh the table after updating an entry
//     },
//     error: function (xhr, textStatus, errorThrown) {
//       console.error("Error updating employee:", textStatus, errorThrown);
//     }
//   });
// }

// function deleteEmployee(employeeId) {
//   webapi.safeAjax({
//     type: "DELETE",
//     url: "/_api/cr935_crudemps/" + employeeId,
//     contentType: "application/json",
//     success: function (res) {
//       console.log("Employee deleted:", res);
//       fetchDataAndDisplay(); // Refresh the table after deleting an entry
//     },
//     error: function (xhr, textStatus, errorThrown) {
//       console.error("Error deleting employee:", textStatus, errorThrown);
//     }
//   });
// }
