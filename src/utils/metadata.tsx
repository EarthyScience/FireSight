export function updateMetadataDescription(meta, containerId) {
    const cDescription = document.getElementById(containerId);
    
    if (cDescription && Object.keys(meta).length > 0) {
      // Create header
      let content = '<strong class="metadata-header">Metadata</strong>';
      // Create a container for the metadata content
      content += '<div class="metadata-content">';
      // Convert the meta object to a formatted string with bold keys
      const metaString = Object.entries(meta)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `<strong>${key}</strong>: [${value.join(', ')}]`;
          }
          return `<strong>${key}</strong>: ${value}`;
        })
        .join('<br>');
      // Add metadata to the container
      content += metaString;
      content += '</div>';
      // Update the content
      cDescription.innerHTML = content;
  
      // Add event listeners for hover
      const header = cDescription.querySelector('.metadata-header');
      const metadataContent = cDescription.querySelector('.metadata-content');
      const showContent = () => {
        metadataContent.style.display = 'block';
      };
      const hideContent = () => {
        metadataContent.style.display = 'none';
      };
      header.addEventListener('mouseenter', showContent);
      cDescription.addEventListener('mouseleave', hideContent);
  
      // Return cleanup function
      return () => {
        header.removeEventListener('mouseenter', showContent);
        cDescription.removeEventListener('mouseleave', hideContent);
      };
    }
    
    return () => {}; // Return empty cleanup function if conditions are not met
  }