// Function to add click event to copy buttons
function addCopyButtonListeners() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Log the button click
            console.log('Button clicked!');

            // Get the label text to copy
            const textToCopy = event.target.previousElementSibling.textContent;

            // Dynamically create a textarea element to hold the text
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;

            // Append textarea to the body (it needs to be in the document to copy the text)
            document.body.appendChild(textArea);

            // Select and copy the text in the textarea
            textArea.select();
            textArea.setSelectionRange(0, 99999); // For mobile devices

            try {
                // Copy the text to the clipboard
                const successful = document.execCommand("copy");
                if (successful) {
                    console.log('Text copied to clipboard');
                } else {
                    console.error('Failed to copy text');
                }
            } catch (err) {
                console.error('Error during copy:', err);
            }

            // Remove the textarea from the document
            document.body.removeChild(textArea);

            // Change button text to "Copied" and add "copied" class
            const originalText = button.textContent;
            button.textContent = "✅";
            button.classList.add("copied");

            // Revert the button text and remove "copied" class after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove("copied");
            }, 2000);
        });

        // Prevent button click when clicking on the label text
        button.parentElement.addEventListener('click', function(event) {
            // Check if the click target is not the button
            if (!event.target.closest('.copy-btn')) {
                event.stopPropagation(); // Prevent the button click
            }
        });
    });
}
