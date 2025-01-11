(function (webapi, $) {
  function safeAjax(ajaxOptions) {
      var deferredAjax = $.Deferred();

      shell.getTokenDeferred().done(function (token) {
          // add headers for AJAX
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
              .done(function (data, textStatus, jqXHR) {
                  validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
              }).fail(deferredAjax.reject); //AJAX
      }).fail(function () {
          deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
      });

      return deferredAjax.promise();
  }
  webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery);

    // Function to call the API and fetch user roles
    function getUserRoles() {
      var userId = "23e3b76f-93c1-ee11-9079-000d3a0abbd7"; // Replace with the actual User ID
      
      webapi.safeAjax({
          type: "GET",
          // Query systemuserroles and expand roleid to get role names
          url: "/_api/systemusers(23e3b76f-93c1-ee11-9079-000d3a0abbd7)",
          contentType: "application/json",
          headers: {
              "Prefer": "odata.include-annotations=*"
          },
          success: function (data, textStatus, xhr) {
              var result = data;
              console.log(result);
              // Loop through the roles
              if (result && result.systemuserroles_association) {
                  result.systemuserroles_association.forEach(function (role) {
                      // Extract role details
                      var systemuserroleid = role["systemuserroleid"]; // Guid
                      var roleName = role["roleid"].name; // Role name
                      console.log("Role ID: " + systemuserroleid + ", Role Name: " + roleName);
                  });
              } else {
                  console.log("No roles found for this user.");
              }
          },
          error: function (xhr, textStatus, errorThrown) {
              console.log(xhr);
          }
      });
  }

  // Add click event listener to the button
  document.getElementById('getRolesBtn').addEventListener('click', getUserRoles);
