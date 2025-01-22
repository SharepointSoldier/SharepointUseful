// Function to fetch file size
async function fetchFileSize(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const size = response.headers.get('content-length'); // Get file size in bytes
        if (size) {
          return formatFileSize(size);
        }
      }
      return 'Unknown size';
    } catch (error) {
      console.error('Error fetching file size:', error);
      return 'Error fetching size';
    }
  }
   
  // Function to format file size (bytes -> KB, MB, etc.)
  function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = parseFloat(bytes);
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  }
   
  // Update file sizes dynamically in the HTML
  document.querySelectorAll('.pdf-size').forEach(async (sizeElement) => {
    const fileUrl = sizeElement.getAttribute('data-file-url');
    const fileSize = await fetchFileSize(fileUrl); // Fetch the size dynamically
    sizeElement.textContent = `PDF · ${fileSize}`;
  });
   
  // Add click event listeners to buttons
  document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', event => {
      const fileUrl = button.getAttribute('data-file-url'); // Get file URL
      if (button.classList.contains('download')) {
        // Trigger download
        const a = document.createElement('a');
        a.href = fileUrl; // Use the file URL
        a.download = fileUrl.split('/').pop(); // Extract file name
        a.click();
      } else if (button.classList.contains('open')) {
        // Open in new tab
        window.open(fileUrl, '_blank');
      }
    });
  });