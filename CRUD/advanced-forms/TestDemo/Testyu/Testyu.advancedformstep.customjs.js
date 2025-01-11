document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('cr935_settkryss');
    const fileAttachmentField = document.getElementById('cr935_attachment');

    if (!dropdown || !fileAttachmentField) return;

    function toggleFileAttachment() {
        const fieldContainer = fileAttachmentField.closest('.field-container') || fileAttachmentField.parentElement;
        if (!fieldContainer) return console.error("Parent container not found.");

        const selectedValue = dropdown.value.trim();
        fieldContainer.style.display = selectedValue ? 'block' : 'none';
        fileAttachmentField.style.display = selectedValue ? 'block' : 'none';

        const label = fieldContainer.querySelector('label[for="cr935_attachment"]');
        if (label) label.style.display = selectedValue ? 'block' : 'none';

        const noFileLabel = fieldContainer.querySelector('.ms-BasePicker-text');
        if (noFileLabel) noFileLabel.style.display = selectedValue ? 'block' : 'none';

        const noFileLabelSelector = document.querySelector('#EntityFormView > div.tab.clearfix > div > div > fieldset > table > tbody > tr:nth-child(3) > td.clearfix.cell > div.control > div > div.container-filelink-delete.file-link-and-delete > div.break-file-name.file-name-container > div');
        if (noFileLabelSelector) noFileLabelSelector.style.display = 'none';
    }

    toggleFileAttachment();
    dropdown.addEventListener('change', toggleFileAttachment);
});