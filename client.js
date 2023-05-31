const form = document.getElementById('synthesizeForm');
const audioPlayer = document.getElementById('audioPlayer');
const downloadButton = document.getElementById('downloadButton');
const synthesizeButton = document.getElementById('synthesizeButton');

synthesizeButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    text: formData.get('text'),
    playbackSpeed: formData.get('playbackSpeed'),
  };

  try {
    const response = await fetch('/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const { audioFileUrl } = await response.json();

      // Set the audio source and show the audio player
      audioPlayer.src = audioFileUrl;
      audioPlayer.style.display = 'block';

      // Show the download button with the audio file URL
      downloadButton.href = audioFileUrl;
      downloadButton.style.display = 'block';

      console.log('Text synthesis request sent successfully!');
    } else {
      console.error('Error:', response);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission
});
