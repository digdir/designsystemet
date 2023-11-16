export interface ExampleTableData {
  caseNum: number;
  product: string;
  status: string;
  image: { src: string; alt: string };
}

export const exampleRows: ExampleTableData[] = [
  {
    caseNum: 20220873,
    product: 'Emballasje for snacksprodukter',
    status: 'Under behandling',
    image: {
      src: 'https://search.patentstyret.no/onlinedb_files_ds/Pictures/2022/9/21/317574.png',
      alt: 'Potetgullpose',
    },
  },
  {
    caseNum: 20220590,
    product: 'Apparat for rengjøring av sveisesøm',
    status: 'Registert',
    image: {
      src: 'https://search.patentstyret.no/onlinedb_files_ds/Pictures/2022/6/30/313443.jpg',
      alt: 'Apparat for rengjøring av sveisesøm',
    },
  },
  {
    caseNum: 20220827,
    product: 'Logo',
    status: 'Besluttet gjeldende',
    image: {
      src: 'https://search.patentstyret.no/onlinedb_files_ds/Pictures/2022/9/17/317418.JPG',
      alt: 'Logo',
    },
  },
  {
    caseNum: 20220582,
    product:
      'Modul for handikaprampe, bunnramme til modul for handikaprampe, rekkverk til modul for handikaprampe',
    status: 'Registrert',
    image: {
      src: 'https://search.patentstyret.no/onlinedb_files_ds/Pictures/2022/6/20/313066.jpg',
      alt: 'Bilde av handikaprampe',
    },
  },
  {
    caseNum: 20220408,
    product: 'Bil',
    status: 'Registert',
    image: {
      src: 'https://search.patentstyret.no/onlinedb_files_ds/Pictures/2022/5/11/310547.jpg',
      alt: 'Bil',
    },
  },
  {
    caseNum: 20208507,
    product: 'Vippesykkel',
    status: 'Besluttet gjeldende',
    image: {
      src: 'https://search.patentstyret.no/Onlinedb_files_tm/Pictures/200208/200208507.jpg',
      alt: 'Vippesykkel',
    },
  },
  {
    caseNum: 20081269,
    product: 'SHELL',
    status: 'Besluttet gjeldende',
    image: {
      src: 'https://search.patentstyret.no/Onlinedb_files_tm/Pictures/200431/200812696.jpg',
      alt: 'Shell',
    },
  },
  {
    caseNum: 20110659,
    product: 'DNB',
    status: 'Registrert',
    image: {
      src: 'https://search.patentstyret.no/Onlinedb_files_tm/Pictures/200448/201106591_5%20Figurmerker%20og%20bilder(cropped)%20-%201_200523766_0.jpg',
      alt: 'Dnb',
    },
  },
];
