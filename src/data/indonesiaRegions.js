// Comprehensive Dataset of Indonesian Administrative Regions
// Provinces, Cities/Regencies, Districts, Villages & Postal Codes

export const INDONESIA_PROVINCES = [
  { id: '31', name: 'DKI Jakarta' },
  { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' },
  { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' },
  { id: '34', name: 'DI Yogyakarta' },
  { id: '51', name: 'Bali' },
  { id: '12', name: 'Sumatera Utara' },
  { id: '13', name: 'Sumatera Barat' },
  { id: '16', name: 'Sumatera Selatan' },
  { id: '73', name: 'Sulawesi Selatan' }
];

export const INDONESIA_CITIES = {
  // DKI Jakarta
  '31': [
    { id: '3174', name: 'Kota Jakarta Selatan' },
    { id: '3171', name: 'Kota Jakarta Pusat' },
    { id: '3173', name: 'Kota Jakarta Barat' },
    { id: '3175', name: 'Kota Jakarta Timur' },
    { id: '3172', name: 'Kota Jakarta Utara' }
  ],
  // Jawa Barat
  '32': [
    { id: '3273', name: 'Kota Bandung' },
    { id: '3201', name: 'Kabupaten Bogor' },
    { id: '3275', name: 'Kota Bekasi' },
    { id: '3276', name: 'Kota Depok' },
    { id: '3271', name: 'Kota Bogor' },
    { id: '3216', name: 'Kabupaten Bekasi' },
    { id: '3204', name: 'Kabupaten Bandung' },
    { id: '3217', name: 'Kabupaten Bandung Barat' }
  ],
  // Jawa Tengah
  '33': [
    { id: '3329', name: 'Kabupaten Brebes' },
    { id: '3374', name: 'Kota Semarang' },
    { id: '3372', name: 'Kota Surakarta (Solo)' },
    { id: '3302', name: 'Kabupaten Banyumas' },
    { id: '3328', name: 'Kabupaten Tegal' },
    { id: '3327', name: 'Kabupaten Pemalang' },
    { id: '3376', name: 'Kota Tegal' },
    { id: '3326', name: 'Kabupaten Pekalongan' }
  ],
  // Jawa Timur
  '35': [
    { id: '3578', name: 'Kota Surabaya' },
    { id: '3579', name: 'Kota Malang' },
    { id: '3515', name: 'Kabupaten Sidoarjo' },
    { id: '3525', name: 'Kabupaten Gresik' },
    { id: '3507', name: 'Kabupaten Malang' }
  ],
  // Banten
  '36': [
    { id: '3671', name: 'Kota Tangerang' },
    { id: '3674', name: 'Kota Tangerang Selatan' },
    { id: '3603', name: 'Kabupaten Tangerang' },
    { id: '3673', name: 'Kota Serang' },
    { id: '3672', name: 'Kota Cilegon' }
  ],
  // DI Yogyakarta
  '34': [
    { id: '3471', name: 'Kota Yogyakarta' },
    { id: '3404', name: 'Kabupaten Sleman' },
    { id: '3402', name: 'Kabupaten Bantul' },
    { id: '3401', name: 'Kabupaten Kulon Progo' },
    { id: '3403', name: 'Kabupaten Gunungkidul' }
  ],
  // Bali
  '51': [
    { id: '5171', name: 'Kota Denpasar' },
    { id: '5103', name: 'Kabupaten Badung' },
    { id: '5104', name: 'Kabupaten Gianyar' }
  ],
  // Sumatera Utara
  '12': [
    { id: '1271', name: 'Kota Medan' },
    { id: '1212', name: 'Kabupaten Deli Serdang' }
  ]
};

export const INDONESIA_DISTRICTS = {
  // Kabupaten Brebes (3329)
  '3329': [
    { id: '332904', name: 'Ketanggungan' },
    { id: '332909', name: 'Brebes' },
    { id: '332908', name: 'Jatibarang' },
    { id: '332910', name: 'Bulakamba' },
    { id: '332902', name: 'Bumiayu' },
    { id: '332903', name: 'Paguyangan' },
    { id: '332905', name: 'Banjarharjo' },
    { id: '332906', name: 'Tanjung' },
    { id: '332907', name: 'Losari' }
  ],
  // Kota Jakarta Selatan (3174)
  '3174': [
    { id: '317401', name: 'Kebayoran Baru' },
    { id: '317402', name: 'Kebayoran Lama' },
    { id: '317403', name: 'Cilandak' },
    { id: '317404', name: 'Pesanggrahan' },
    { id: '317405', name: 'Pasar Minggu' },
    { id: '317406', name: 'Jagakarsa' },
    { id: '317407', name: 'Mampang Prapatan' },
    { id: '317408', name: 'Pancoran' },
    { id: '317409', name: 'Tebet' },
    { id: '317410', name: 'Setiabudi' }
  ],
  // Kota Bandung (3273)
  '3273': [
    { id: '327301', name: 'Coblong' },
    { id: '327302', name: 'Cicendo' },
    { id: '327303', name: 'Sumur Bandung' },
    { id: '327304', name: 'Bandung Wetan' },
    { id: '327305', name: 'Lengkong' }
  ],
  // Kota Surabaya (3578)
  '3578': [
    { id: '357801', name: 'Tegalsari' },
    { id: '357802', name: 'Gubeng' },
    { id: '357803', name: 'Wonokromo' },
    { id: '357804', name: 'Sukolilo' }
  ],
  // Kota Tangerang Selatan (3674)
  '3674': [
    { id: '367401', name: 'Serpong' },
    { id: '367402', name: 'Serpong Utara' },
    { id: '367403', name: 'Pondok Aren' },
    { id: '367404', name: 'Ciputat' },
    { id: '367405', name: 'Ciputat Timur' },
    { id: '367406', name: 'Pamulang' }
  ]
};

export const INDONESIA_VILLAGES = {
  // Ketanggungan (332904)
  '332904': [
    { id: '3329042001', name: 'Ketanggungan', postalCode: '52263' },
    { id: '3329042002', name: 'Dukuhturi', postalCode: '52263' },
    { id: '3329042003', name: 'Karangmalang', postalCode: '52263' },
    { id: '3329042004', name: 'Kubangsari', postalCode: '52263' },
    { id: '3329042005', name: 'Tanggeran', postalCode: '52263' },
    { id: '3329042006', name: 'Cikeusal', postalCode: '52263' },
    { id: '3329042007', name: 'Ciduwet', postalCode: '52263' }
  ],
  // Brebes (332909)
  '332909': [
    { id: '3329091001', name: 'Brebes', postalCode: '52212' },
    { id: '3329091002', name: 'Gandasuli', postalCode: '52215' },
    { id: '3329091003', name: 'Pasarbatang', postalCode: '52211' }
  ],
  // Kebayoran Baru (317401)
  '317401': [
    { id: '3174011001', name: 'Senayan', postalCode: '12190' },
    { id: '3174011002', name: 'Rawa Barat', postalCode: '12180' },
    { id: '3174011003', name: 'Selong', postalCode: '12110' },
    { id: '3174011004', name: 'Gunung', postalCode: '12120' },
    { id: '3174011005', name: 'Kramat Pela', postalCode: '12130' }
  ],
  // Serpong (367401)
  '367401': [
    { id: '3674011001', name: 'BSD City', postalCode: '15310' },
    { id: '3674011002', name: 'Lengkong Gudang', postalCode: '15321' },
    { id: '3674011003', name: 'Rawa Buntu', postalCode: '15318' }
  ]
};

// Helper to get cities for a province ID
export const getCitiesByProvince = (provinceId) => {
  return INDONESIA_CITIES[provinceId] || [
    { id: `${provinceId}-c1`, name: 'Kota / Kabupaten Utama' },
    { id: `${provinceId}-c2`, name: 'Kota / Kabupaten Sekitar' }
  ];
};

// Helper to get districts for a city ID
export const getDistrictsByCity = (cityId) => {
  return INDONESIA_DISTRICTS[cityId] || [
    { id: `${cityId}-d1`, name: 'Kecamatan Pusat' },
    { id: `${cityId}-d2`, name: 'Kecamatan Barat' },
    { id: `${cityId}-d3`, name: 'Kecamatan Timur' }
  ];
};

// Helper to get villages for a district ID
export const getVillagesByDistrict = (districtId) => {
  return INDONESIA_VILLAGES[districtId] || [
    { id: `${districtId}-v1`, name: 'Kelurahan / Desa Utama', postalCode: '50000' },
    { id: `${districtId}-v2`, name: 'Kelurahan / Desa Barat', postalCode: '50001' }
  ];
};

// Helper to format structured address into a clear delivery string
export const formatStructuredAddress = (addressObj) => {
  if (!addressObj) return '';
  if (typeof addressObj === 'string') return addressObj;

  const {
    street = '',
    houseNumber = '',
    villageName = '',
    districtName = '',
    cityName = '',
    provinceName = '',
    postalCode = '',
    additionalDetails = ''
  } = addressObj;

  const mainStreet = [street, houseNumber ? `No. ${houseNumber}` : ''].filter(Boolean).join(' ');
  const regionParts = [
    villageName ? `Desa/Kel. ${villageName}` : '',
    districtName ? `Kec. ${districtName}` : '',
    cityName,
    provinceName,
    postalCode
  ].filter(Boolean).join(', ');

  const detailPart = additionalDetails ? ` (Detail: ${additionalDetails})` : '';

  return `${mainStreet}${mainStreet && regionParts ? ', ' : ''}${regionParts}${detailPart}`;
};
