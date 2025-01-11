document.addEventListener("DOMContentLoaded", function () {
   
    const dropdown = document.getElementById("cr935_settkryss"); 
    const fileAttachmentFieldContainer = document.getElementById("cr935_attachment");

    // Ensure the file attachment field is initially hidden
    fileAttachmentFieldContainer.style.display = "none";

    // Add event listener for the dropdown change
    dropdown.addEventListener("change", function () {
        const selectedValue = dropdown.value;

        // Replace 'ShowValue' with the dropdown value that should make the file attachment visible
        if (selectedValue === "ShowValue") {
            fileAttachmentFieldContainer.style.display = "block"; // Show file attachment field
        } else {
            fileAttachmentFieldContainer.style.display = "none"; // Hide file attachment field
        }
    });
});