const svg=(body)=>`<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g stroke="#233e43" stroke-width="3" stroke-linejoin="round">${body}</g></svg>`;
export function icon(id){return svg({
cone:'<path fill="#ed773b" d="M18 83 43 17h14l25 66Z"/><path fill="#fff6d3" d="m34 42-5 14h42l-5-14Z"/><rect fill="#d85d2e" x="12" y="82" width="76" height="10" rx="4"/>',
hoop:'<ellipse cx="50" cy="52" rx="35" ry="38" fill="none" stroke="#f1b83e" stroke-width="10"/>',
rope:'<path d="M22 24C-10 90 96 108 80 25" fill="none" stroke="#41b3ae" stroke-width="7"/><path d="m18 15 11 4-9 26-11-4ZM76 15l11-2 7 27-11 3Z" fill="#e97246"/>',
racket:'<ellipse cx="48" cy="34" rx="25" ry="29" fill="#d4e6dc" stroke="#418c92" stroke-width="7"/><path d="M33 12v44m10-49v55m11-53v51m10-45v38M24 25h47M24 37h47M30 49h36" stroke-width="1"/><path d="m45 64-4 29h14l-3-29" fill="#efb14c"/>',
bib:'<path d="m33 12-18 18 10 17 10-7v48h43V40l9 7 8-17-20-18-12 12H46Z" fill="#52b3bd" transform="translate(-7 0)"/><path d="M35 54h28" stroke="#f6eccb" stroke-width="8"/>',
mat:'<path d="m9 52 64-26 20 37-63 27Z" fill="#508fbb"/><path d="m9 52 21 31 63-27v7L30 90 9 59Z" fill="#316d92"/><path d="m22 53 46-19M29 64l47-20" stroke="#86b5cc"/>',
beanbag:'<path d="M24 25Q50 15 76 26L84 73Q50 87 16 73Z" fill="#bc6a90"/><path d="M27 30 22 68Q50 78 77 68L72 30" fill="none" stroke="#edafc3" stroke-dasharray="4 3"/>',
basketball:'<circle cx="50" cy="50" r="38" fill="#e88d3d"/><path d="M12 50h76M50 12v76M22 24q54 25 56 52M78 24Q24 49 22 76" fill="none"/>',
football:'<circle cx="50" cy="50" r="38" fill="#f7efdc"/><path fill="#354c54" d="m50 33 17 12-7 20H40l-7-20ZM25 20l9 10-12 15-10-3m63-22-9 10 12 15 10-3M19 72l16-4 5 18m41-14-16-4-5 18"/>',
softball:'<circle cx="50" cy="50" r="36" fill="#a9bf59"/><path d="M24 25q47 4 51 49M74 24Q28 30 25 75" fill="none" stroke="#e1e8ad" stroke-width="5"/>'
}[id]||'');}
