const generateTaskId = (title: string, timestamp: number): string => {
    // Combine title and timestamp
    const input = `${title}-${timestamp}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to base36 string for shorter representation
    return Math.abs(hash).toString(36);
  };
  export default generateTaskId;