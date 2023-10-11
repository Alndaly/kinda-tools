// file referenced from docs

const
  hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/,
  hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/,
  hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/,
  rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/

// Keep in sync with ui/types/api/validation.d.ts
export const testPattern = {
  date: (v: string) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: (v: string) => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  fulltime: (v: string) => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: (v: string) => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),

  // -- RFC 5322 --
  // -- Added in v2.6.6 --
  // This is a basic helper validation.
  // For something more complex (like RFC 822) you should write and use your own rule.
  // We won't be accepting PRs to enhance the one below because of the reason above.
  // eslint-disable-next-line
  email: (v: string) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),

  hexColor: (v: string) => hex.test(v),
  hexaColor: (v: string) => hexa.test(v),
  hexOrHexaColor: (v: string) => hexOrHexa.test(v),

  rgbColor: (v: string) => rgb.test(v),
  rgbaColor: (v: string) => rgba.test(v),
  rgbOrRgbaColor: (v: string) => rgb.test(v) || rgba.test(v),

  hexOrRgbColor: (v: string) => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: (v: string) => hexa.test(v) || rgba.test(v),
  anyColor: (v: string) => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
}

export default {
  testPattern
}
