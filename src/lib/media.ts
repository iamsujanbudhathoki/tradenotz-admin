export  const getFileMediaType = (file: File): "IMAGE" | "PDF" | "DOCUMENT" => {
    const fileType = file.type.toLowerCase();
    if (fileType.startsWith("image/")) {
      return "IMAGE";
    } else if (fileType === "application/pdf") {
      return "PDF";
    } else {
      return "DOCUMENT";
    }
  };
