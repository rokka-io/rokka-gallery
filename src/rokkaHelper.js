const getStackByDimensions = (
  template = 'dynamic/resize-width-${width}-height-${height}-upscale-false-sharpen-true',
  width = null,
  height = null
) => {
  if (height === null) {
    height = width;
  }
  if (width !== null) {
    return template.replace('${width}', width).replace('${height}', height);
  }
  return template;
};

const getOriginalCompatibleFormat = (image, format = null) => {
  if (format === null) {
    format = 'jpg';
    if (image['mimetype'] === 'image/png') {
      format = 'png';
    } else if (image['mimetype'] === 'image/gif') {
      format = 'gif';
    } else if (image['mimetype'] === 'image/svg+xml') {
      format = 'svg';
    }
  }
  return format;
};

export default {
  renderUrl: (
    image,
    rokkaOrg,
    width,
    height = null,
    format = null,
    stack = 'dynamic/resize-width-${width}-height-${height}-upscale-false-sharpen-true'
  ) => {
    stack = getStackByDimensions(stack, width, height);
    format = getOriginalCompatibleFormat(image, format);
    if (image && image.short_hash) {
      return `https://${rokkaOrg}.rokka.io/${stack}/${
        image.short_hash
      }/${image.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[.?]/g, '_')}_v5781632.${format}`;
    }

    return '';
  },

  getStackByDimensions: (
    width = null,
    height = null,
    template = 'dynamic/resize-width-${width}-height-${height}-upscale-false-sharpen-true'
  ) => {
    return getStackByDimensions(template, width, height);
  },

  getOriginalCompatibleFormat: (image, format = null) => {
    let endformat = getOriginalCompatibleFormat(image, format);
    // just return as jpg, if it's a big png and is opaque
    if (endformat === 'png' && image.opaque === true && image.size > 1000000) {
      endformat = 'jpg';
    }
    return endformat;
  },

  imageTitle: image => {
    if (
      image.static_metadata &&
      image.static_metadata.exif &&
      image.static_metadata.exif.title
    ) {
      return image.static_metadata.exif.title + ' (' + image.name + ')';
    }
    return image.name;
  },
};
