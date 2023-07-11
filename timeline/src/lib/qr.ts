import { browser } from "$app/environment";
import { QRCodeCanvas as QrCode, type Options as QrOptions } from "@loskir/styled-qr-code-node";

import { type Entry } from "./models/timeline";

import logo_csr from "$lib/assets/favicon.png";
import { base_url } from "$lib/stores/env";


export type Options = {
  color: boolean,
  size: number,
};

export function qr_from_entry(entry: Entry, options: Options): QrCode {
  return qr(`${base_url.origin}/qr/e${entry.id}`, options);
}

export function qr(data: string, options: Options): QrCode {
  let qr_options: QrOptions = {
    data: data,
    width: options.size,
    height: options.size,
    // during ssr, the global fetch cannot handle relative urls
    image: browser ? logo_csr : `${base_url.origin}/assets/favicon.png`,
    qrOptions: {
      mode: "Byte",
      errorCorrectionLevel: "M",  // L: 7%, M: 15%, Q: 25%, H: 30%
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: options.size * 0.02,
    },
    dotsOptions: {
      gradient: {
        type: "linear",
        rotation: (Math.PI * 2 / 360) * 45,
        colorStops: [
          { offset: 0, color: "#9e0814" }, { offset: 1, color: "#9e0814" }
        ]
      },
      type: "extra-rounded",
    },
    backgroundOptions: { color: "#00000000" },
    cornersSquareOptions: { color: "#9e0814" },
    cornersDotOptions: { color: "#000000" },
  };

  if (!options.color) {
    qr_options.dotsOptions = { color: "#000000", type: "extra-rounded" };
    qr_options.cornersSquareOptions = { color: "#000000" };
  }

  return new QrCode(qr_options);
}

// async function generate_qr(options: Options): Promise<Blob> {
//   const qr = new QRCode(options);
//   const data: Buffer = await qr.toBuffer("png");

//   if (browser) {
//     const blob = new Blob([data], { type: "image/png" });
//     return URL.createObjectURL(blob);
//   } else {
//     return `data:image/png;base64,${data.toString("base64")}`;
//   }
// }

// async function blobAsDataURL(blob: Blob): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result as string);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// }

// export function download(format: FileExtension) {
//   let qr = new QRCode(options);
//   qr.download({ name: "qrcode", extension: format });
// }
