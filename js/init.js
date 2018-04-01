_.delay(() => {
    if (OCA && OCA.Ocr && OCA.Ocr.Admin) {
        OCA.Ocr.$admin = new OCA.Ocr.Admin(document, $, OC);
    } else if (OCA && OCA.Ocr && OCA.Ocr.App) {
        OCA.Ocr.$app = new OCA.Ocr.App(document, $, _, OC, OCA);
    } else if (OCA && OCA.Ocr && OCA.Ocr.Personal) {
        OCA.Ocr.$personal = new OCA.Ocr.Personal(document, $, OC);
    } else {
        console.error('The ocr app could not be initiallized.');
    }
}, 1000);
