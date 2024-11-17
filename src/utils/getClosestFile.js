const getClosestFile = (query, files) => {
  // Normalize the query
  const searchQuery = query
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  // Function to find the closest match
  function getClosestMatch(query, files) {
    let closestFile = null;
    let closestDistance = Infinity;

    files.forEach((file) => {
      const fileName = file.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");
      const distance = levenshteinDistance(query, fileName);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestFile = file;
      }
    });

    return closestFile;
  }

  // Levenshtein distance function
  function levenshteinDistance(a, b) {
    const tmp = [];
    let i,
      j,
      alen = a.length,
      blen = b.length,
      ch;
    for (i = 0; i <= alen; i++) {
      tmp[i] = [i];
    }
    for (j = 0; j <= blen; j++) {
      tmp[0][j] = j;
    }
    for (i = 1; i <= alen; i++) {
      ch = a.charAt(i - 1);
      for (j = 1; j <= blen; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1, // deletion
          tmp[i][j - 1] + 1, // insertion
          tmp[i - 1][j - 1] + (ch === b.charAt(j - 1) ? 0 : 1) // substitution
        );
      }
    }
    return tmp[alen][blen];
  }

  const closestAudioFile = getClosestMatch(searchQuery, files);
  if (closestAudioFile) {
    return closestAudioFile;
  } else {
    console.log("No matching audio file found.");
    return null;
  }
};

module.exports = getClosestFile;
