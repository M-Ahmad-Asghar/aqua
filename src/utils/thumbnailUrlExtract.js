export function getYouTubeThumbnailUrl(videoUrl) {
    // Extract the video ID from the YouTube URL
    const videoIdRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\/?v=|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\w\s-]|$)/;
    const match = videoUrl.match(videoIdRegex);
  
    if (match && match[1]) {
      // Construct the thumbnail URL using the video ID
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  
    // Return null or a default thumbnail URL if the video ID is not valid
    return null;
  }
  