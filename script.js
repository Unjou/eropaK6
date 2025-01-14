document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([54.5260, 15.2551], 4);

    L.Map.prototype.options.zoomAnimation = false;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function style(feature) {
        switch (feature.properties.REGION) {
          case 'Northern Europe': return { color: "#a6cee3" };
          case 'Western Europe': return { color: "#1f78b4" };
          case 'Central Europe': return { color: "#b2df8a" };
          case 'Southern Europe': return { color: "#33a02c" };
          case 'Eastern Europe': return { color: "#fb9a99" };
          case 'Southeastern Europe': return { color: "#e31a1c" };
        }
      }

    const developingEUExplanations = {
        PL: {
            title: "Polandia di Uni Eropa",
            reasons: [
                "Bergabung dengan EU relatif baru (2004)",
                "Masih dalam proses transformasi ekonomi",
                "Fokus pada pembangunan infrastruktur",
                "Perbedaan pendapatan dengan negara EU Barat",
                "Proses industrialisasi berkelanjutan"
            ]
        },
        RO: {
            title: "Romania di Uni Eropa",
            reasons: [
                "Bergabung dengan EU tahun 2007",
                "Warisan ekonomi pasca-komunis",
                "Pembangunan infrastruktur masih berlangsung",
                "Reformasi sistem masih berjalan",
                "Kesenjangan ekonomi regional"
            ]
        },
        BG: {
            title: "Bulgaria di Uni Eropa",
            reasons: [
                "Anggota EU termuda (2007)",
                "Transisi ekonomi masih berlangsung",
                "Tantangan reformasi struktural",
                "Proses modernisasi berkelanjutan",
                "Penyesuaian standar EU"
            ]
        },
        HR: {
            title: "Kroasia di Uni Eropa",
            reasons: [
                "Bergabung dengan EU tahun 2013",
                "Pemulihan pasca-konflik regional",
                "Restrukturisasi ekonomi berkelanjutan",
                "Pengembangan sektor pariwisata",
                "Adaptasi kebijakan EU"
            ]
        },
        HU: {
            title: "Hungaria di Uni Eropa",
            reasons: [
                "Transisi ekonomi masih berlanjut",
                "Tantangan reformasi struktural",
                "Penyesuaian dengan pasar EU",
                "Modernisasi industri berkelanjutan",
                "Pengembangan infrastruktur"
            ]
        }
    };

    const regions = {
        northern: {
            name: "Eropa Utara",
            description: "Wilayah yang mencakup negara-negara Skandinavia dan Baltik, terkenal dengan kesejahteraan sosial dan teknologi tinggi.",
            color: "#8BC34A",
            bounds: [[53.31774904749089, -25.092285156250001], [71.35706654962706, 31.772460937500004]]
        },
        western: {
            name: "Eropa Barat",
            description: "Pusat ekonomi dan budaya Eropa, dengan negara-negara maju dan berpengaruh secara global.",
            color: "#E91E63",
            bounds: [[43.32517767999296, -11.337890625000002], [55.97379820507658, 7.207031250000001]]
        },
        central: {
            name: "Eropa Tengah",
            description: "Wilayah dengan sejarah kaya dan perkembangan ekonomi yang pesat.",
            color: "#2196F3",
            bounds: [[45.89000815866184, 8.61328125], [54.97761367069628, 24.257812500000004]]
        },
        eastern: {
            name: "Eropa Timur",
            description: "Wilayah dengan potensi ekonomi besar dan warisan budaya yang kuat.",
            color: "#FFC107",
            bounds: [[44.96479793033101, 24.43359375], [62.103882522897855, 40.78125]]
        },
        southern: {
            name: "Eropa Selatan",
            description: "Wilayah Mediterania dengan budaya, kuliner, dan pariwisata yang terkenal.",
            color: "#FF5722",
            bounds: [[36.31512514748051, -9.492187500000002], [44.84029065139799, 19.335937500000004]]
        },
        southeastern: {
            name: "Eropa Tenggara",
            description: "Wilayah dengan keragaman budaya dan perkembangan ekonomi yang dinamis.",
            color: "#FF9800",
            bounds: [[39.36827914916014, 19.51171875], [48.45835188280866, 29.179687500000004]]
        }
    };

    const regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const region = btn.dataset.region;
            showRegion(region);
            regionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const euMembers = {
        AT: "Austria",
        BE: "Belgia",
        BG: "Bulgaria",
        HR: "Kroasia",
        CY: "Siprus",
        CZ: "Republik Ceko",
        DK: "Denmark",
        EE: "Estonia",
        FI: "Finlandia",
        FR: "Prancis",
        DE: "Jerman",
        GR: "Yunani",
        HU: "Hungaria",
        IE: "Irlandia",
        IT: "Italia",
        LV: "Latvia",
        LT: "Lithuania",
        LU: "Luksemburg",
        MT: "Malta",
        NL: "Belanda",
        PL: "Polandia",
        PT: "Portugal",
        RO: "Romania",
        SK: "Slovakia",
        SI: "Slovenia",
        ES: "Spanyol",
        SE: "Swedia"
    };
    

    fetch('https://raw.githubusercontent.com/Unjou/Geojson/refs/heads/main/map.geojson')
        .then(response => response.json())
        .then(data => {

            const layerManager = new Map();
            
            L.geoJSON(data, {
                style: function(feature) {
                    return {
                        fillColor: getCountryColor(feature.properties.ISO2),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: (feature, layer) => {
                    const countryCode = feature.properties.ISO2;
                    const country = countries[countryCode];
                    
                    if (layerManager.has(countryCode)) {
                        layerManager.get(countryCode).push(layer);
                    } else {
                        layerManager.set(countryCode, [layer]);
                    }

                    if (country) {
                        let center = layer.getBounds().getCenter();
                        if (countryCode === 'NO') {
                            center = L.latLng(61.5, 8.5); 
                        } else if (countryCode === 'HR') {
                            center = L.latLng(45.1, 15.2); 
                        }

                        const label = L.divIcon({
                            className: 'country-label',
                            html: `<div>
                                    <img src="${country.flag}" alt="${country.name} flag" class="country-flag"/>
                                    <span>${country.name}</span>
                                  </div>`
                        });
                        L.marker(center, { icon: label }).addTo(map);

                        layer.on({
                            click: () => {
                                showCountryInfo(countryCode);
                            },
                            mouseover: (e) => {
                                layer.setStyle({
                                    weight: 2,
                                    fillOpacity: 0.9
                                });
                            },
                            mouseout: (e) => {
                                layer.setStyle({
                                    weight: 1,
                                    fillOpacity: 0.7
                                });
                            }
                        });
                    }
                }
            }).addTo(map);
        });

        function showRegion(regionKey) {
        if (regionKey === 'all') {
            map.setView([54.5260, 15.2551], 4);
            return;
        }
        const region = regions[regionKey];
        map.fitBounds(region.bounds, { animate: true, duration: 1 });
        
        document.getElementById('region-info').style.display = 'block';
        document.getElementById('country-info').style.display = 'none';
        document.getElementById('region-name').textContent = region.name;
        document.getElementById('region-description').textContent = region.description;
    }

    function showCountryInfo(countryCode) {
        const country = countries[countryCode];
        if (country) {
            document.getElementById('country-info').style.display = 'block';
            
            const headerHtml = `
                <div class="country-header">
                    <img src="${country.flag}" alt="Bendera ${country.name}" class="country-flag">
                    <div class="country-title">
                        <h2>${country.name}</h2>
                        <span class="country-status-badge status-${country.status}">
                            ${country.status === 'developed' ? 'Negara Maju' : 'Negara Berkembang'}
                        </span>
                    </div>
                </div>
            `;
            document.getElementById('country-header').innerHTML = headerHtml;

            // grid
            const infoGridHtml = `
                <div class="info-section">
                    <h3>Ibu Kota</h3>
                    <p>${country.capital}</p>
                </div>
                <div class="info-section">
                    <h3>Populasi</h3>
                    <p>${country.population}</p>
                </div>
                <div class="info-section">
                    <h3>Mata Uang</h3>
                    <p>${country.currency}</p>
                </div>
                <div class="info-section">
                    <h3>Bahasa</h3>
                    <p>${country.language}</p>
                </div>
            `;
            document.getElementById('info-grid').innerHTML = infoGridHtml;

            const productsHtml = `
            <h3 class="center-text">Produk Utama</h3>
            <div class="products-grid">
                ${country.products.map(product => `
                    <div class="product-icon">
                        ${product.icon}
                        <div class="product-description">${product.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('products-section').innerHTML = productsHtml;

            document.getElementById('country-description').textContent = country.description;

            const euInfo = document.getElementById('eu-info');
            if (country.isEU) {
                euInfo.style.display = 'block';
                if (country.status === 'developing') {
                    euInfo.innerHTML = `
                        <span class="eu-info-text">Anggota Uni Eropa</span>
                        <span class="info-icon" onclick="showDevelopingEUInfo('${countryCode}')">ⓘ</span>
                    `;
                } else {
                    euInfo.innerHTML = `
                        <span class="eu-info-text">Anggota Uni Eropa</span>
                        <span class="info-icon" onclick="showEUInfo()">ⓘ</span>
                    `;
                }
            } else {
                euInfo.style.display = 'none';
            }
        }
    }

    function showEUInfo() {
        const modal = document.createElement('div');
        modal.className = 'eu-modal';
        modal.innerHTML = `
            <div class="eu-modal-content">
                <h2>Uni Eropa (European Union)</h2>
                <p>Uni Eropa adalah persatuan ekonomi dan politik unik antara 27 negara Eropa. 
                   Didirikan setelah Perang Dunia II, EU telah berkembang menjadi pasar tunggal yang luas 
                   dengan Euro sebagai mata uang bersama di mayoritas negara anggotanya.</p>
                
                <h3>Mengapa negara anggota EU cenderung maju?</h3>
                <ul>
                    <li>Pasar tunggal yang memungkinkan perdagangan bebas antar negara anggota</li>
                    <li>Standardisasi regulasi dan kebijakan yang mendorong efisiensi</li>
                    <li>Dukungan finansial untuk pembangunan infrastruktur</li>
                    <li>Kerjasama dalam penelitian dan inovasi teknologi</li>
                    <li>Mobilitas tenaga kerja yang tinggi antar negara anggota</li>
                    <li>Stabilitas politik dan ekonomi yang terjamin</li>
                </ul>
                
                <button onclick="this.parentElement.parentElement.remove()">Tutup</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function getCountryColor(countryCode) { 
        const country = countries[countryCode]; 
        if (!country) return '#ccc'; if (country.isEU) 
            return '#4CAF50'; return country.status === 'developed' ? '#8BC34A' : '#FFC107'; } 
        });

const countries = {
    AL: {
        name: "Albania",
        region: "southeastern",
        status: "developing",
        capital: "Tirana",
        population: "2,8 juta",
        currency: "Lek Albania (ALL)",
        language: "Albania",
        flag: "https://flagcdn.com/al.svg",
        description: "Albania termasuk negara berkembang. Meskipun ada beberapa sektor yang maju, seperti pariwisata, secara keseluruhan pendapatan per kapita mereka masih lebih rendah dibandingkan negara-negara maju di Eropa Barat. ",
        products: [
            { icon: "🍎", description: "Perkebunan" },
            { icon: "🏝️", description: "Pariwisata" }
        ],
        isEU: false
    },
    AD: {
        name: "Andorra",
        region: "southern",
        status: "developed",
        capital: "Andorra la Vella",
        population: "77.000",
        currency: "Euro (EUR)",
        language: "Catalan",
        flag: "https://flagcdn.com/ad.svg",
        description: "Perekonomian Andorra sangat bergantung pada sektor pariwisata, terutama karena lokasinya yang strategis di Pegunungan Pyrenees, yang menarik wisatawan untuk olahraga musim dingin seperti ski dan pariwisata alam. Sektor pariwisata ini menyumbang lebih dari 80% terhadap PDB negara. Selain pariwisata, Andorra juga memiliki sistem keuangan yang penting, dengan perbankan sebagai sektor utama. ",
        products: [
            { icon : "🏝️", description: "Pariwsata"}, 
            {icon: "🏭", description: "Industri"}, 
            {icon: "💰", description: "Perbankan"}
        ],
        isEU: false
    },

    XK: {
        name: "Kosovo",
        region: "southeastern",
        status: "developing",
        capital: "Pristina",
        population: "1,8 juta",
        currency: "Euro (EUR)",
        language: "Albania, Serbia",
        flag: "https://flagcdn.com/xk.svg",
        description: "Kosovo termasuk negara berkembang. Meskipun ada beberapa sektor yang menunjukkan pertumbuhan, seperti teknologi informasi, secara keseluruhan pendapatan per kapita mereka masih rendah dibandingkan negara maju. Selain itu, infrastruktur di beberapa daerah masih perlu ditingkatkan, dan pengangguran masih jadi masalah.",
        products: [
            {icon: "🚜", description: "Pertanian"},
            {icon: "💻", description: "Teknologi Informasi"}, 
            {icon: "🪨", description: "Pertambangan"}
        ],
        isEU: false,
    },

    AT: {
        name: "Austria",
        region : "central",
        status: "developed",
        capital: "Vienna",
        population: "8,9 juta",
        currency: "Euro (EUR)",
        language: "Jerman",
        flag: "https://flagcdn.com/at.svg",
        description: "Negara pegunungan di Eropa Tengah dengan warisan musik klasik yang kaya dan arsitektur barok yang indah.",
        products: [
                {icon:"🚗", description:"Otomotif"}, 
                {icon:"🏭", description:"Industri"}, 
                {icon:"🏝️", description:"Pariwisata"}
            ],
        isEU: true
    },
    BY: {
        name: "Belarus",
        region: "eastern",
        status: "developing",
        capital: "Minsk",
        population: "9,4 juta",
        currency: "Rubel Belarus (BYN)",
        language: "Belarus, Rusia",
        flag: "https://flagcdn.com/by.svg",
        description: " Perekonomian Belarus sangat bergantung pada sektor industri berat, termasuk manufaktur mesin, produk kimia, dan energi. Namun, struktur ekonominya masih kurang bervariasi, dan sektor swasta tidak berkembang pesat karena dominasi negara dalam banyak aspek ekonomi.",
        products: [
            {icon:"🚜", description:"Pertanian"},
            {icon:"⚙️", description:"Manufaktur"}
        ],
        isEU: false
    },
    BE: {
        name: "Belgia",
        region: "western",
        status: "developed",
        capital: "Brussels",
        population: "11,5 juta",
        currency: "Euro (EUR)",
        language: "Belanda, Prancis, Jerman",
        flag: "https://flagcdn.com/be.svg",
        description: "Negara ini juga menjadi tuan rumah bagi banyak lembaga internasional, termasuk markas besar Uni Eropa di Brussels, yang menjadikan Belgia sebagai pusat diplomasi global. elabuhan Antwerp adalah salah satu pelabuhan terbesar di dunia dan pusat penting untuk perdagangan global, khususnya untuk impor dan ekspor barang. Industri utama Belgia meliputi kimia, farmasi, otomotif, dan teknologi.",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"💊", description:"Farmasi"}, 
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    BA: {
        name: "Bosnia dan Herzegovina",
        region: "southeastern",
        status: "developing",
        capital: "Sarajevo",
        population: "3,3 juta",
        currency: "Mark Konvertibel (BAM)",
        language: "Bosnian, Serbian, Croatian",
        flag: "https://flagcdn.com/ba.svg",
        description: "Ekonomi Bosnia dan Herzegovina sebagian besar bergantung pada sektor industri dan pertanian, namun tingkat diversifikasi ekonomi yang rendah menghambat pertumbuhannya. Beberapa sektor, seperti manufaktur dan energi, memiliki potensi untuk berkembang, tetapi ekonomi masih terhambat oleh pengangguran yang tinggi, ketergantungan pada sektor publik, serta korupsi yang masih menjadi masalah signifikan. ",
        products: [
            {icon:"🚜", description:"Pertanian"}, 
            {icon:"🏭", description:"Industri"}
         ],
        isEU: false
    },
    BG: {
        name: "Bulgaria",
        region: "southeastern",
        status: "developing",
        capital: "Sofia",
        population: "7 juta",
        currency: "Lev Bulgaria (BGN)",
        language: "Bulgaria",
        flag: "https://flagcdn.com/bg.svg",
        description: "Bulgaria termasuk negara maju karena beberapa faktor. Pertama, mereka punya industri yang cukup kuat, terutama di bidang otomotif dan teknologi informasi. Kedua, Bulgaria berhasil menarik investasi asing, terutama dari perusahaan-perusahaan besar di Eropa Barat. Ketiga, pariwisata jadi sektor penting, terutama karena pantai-pantai di Laut Hitam dan situs bersejarah yang menarik banyak pengunjung.",
        products: [
            {icon:"💻", description:"Teknologi"}, 
            {icon:"🚗", description:"Otomotif"}, 
            {icon:"🏖️", description:"Pariwisata"}
        ],
        isEU: true
    },
    HR: {
        name: "Kroasia",
        region : "central",
        status: "developed",
        capital: "Zagreb",
        population: "4 juta",
        currency: "Euro (EUR)",
        language: "Kroasia",
        flag: "https://flagcdn.com/hr.svg",
        description: "Dengan sektor pariwisata yang berkembang pesat, ekonomi negara ini sangat bergantung pada wisatawan, terutama yang tertarik dengan pantai-pantai Adriatik, kota bersejarah seperti Dubrovnik, serta situs alam dan budaya lainnya. Pariwisata menjadi salah satu kontributor utama terhadap PDB negara ini. Kroasia memiliki sektor industri yang berkembang, terutama dalam bidang manufaktur, otomotif, dan farmasi. Negara ini juga telah mengembangkan sektor teknologi dan informasi, meskipun masih kalah dibandingkan dengan negara-negara maju lainnya di Eropa.",
        products: [
            {icon:"🚗", description:"Otomotif"}, 
            {icon:"🚜", description:"Pertanian"},
            {icon:"🏖️", description:"Pariwisata"}
        ],
        isEU: true
    },
    CY: {
        name: "Siprus",
        region: "southeastern", 
        status: "developed",
        capital: "Nicosia",
        population: "1,2 juta",
        currency: "Euro (EUR)",
        language: "Yunani, Turki",
        flag: "https://flagcdn.com/cy.svg",
        description: "Ekonomi Siprus sangat bergantung pada sektor jasa, khususnya pariwisata, perbankan, dan layanan keuangan. Sektor perbankan, meskipun menjadi salah satu yang terbesar di kawasan tersebut, sempat menghadapi krisis pada 2012-2013 yang mengakibatkan kerugian besar dan memaksa negara untuk menerima bantuan keuangan internasional. ",
        products: [
            {icon:"🍊", description:"Buah"}, 
            {icon:"🧀", description:"Olahan Pangan"}, 
            {icon:"🏖️", description:"Pariwisata"}
        ],
        isEU: true
    },
    CZ: {
        name: "Republik Ceko",
        region : "central",
        status: "developed",
        capital: "Praha",
        population: "10,7 juta",
        currency: "Koruna Ceko (CZK)",
        language: "Ceko",
        flag: "https://flagcdn.com/cz.svg",
        description: "Republik Ceko memiliki ekonomi yang stabil, didukung oleh sektor industri yang kuat, terutama di bidang manufaktur, teknologi, dan otomotif. Selain itu, negara ini memiliki angka pengangguran yang rendah dan kualitas hidup yang tinggi bagi warganya. Dengan menjadi anggota Uni Eropa sejak tahun 2004, Republik Ceko juga telah memperkuat hubungan perdagangan internasionalnya, yang semakin mendukung pertumbuhan ekonominya.",
        products: [
            {icon:"🚗", description:"Otomotif"}, 
            {icon:"📺", description:"Elektronik"}, 
            {icon:"💻", description:"Teknologi"},
            {icon:"🏝️", description:"Parwisata"}
        ],
        isEU: true
    },
    DK: {
        name: "Denmark",
        region: "northern",
        status: "developed",
        capital: "Copenhagen",
        population: "5,8 juta",
        currency: "Krone Denmark (DKK)",
        language: "Denmark",
        flag: "https://flagcdn.com/dk.svg",
        description: "Perekonomian Denmark didorong oleh sektor-sektor seperti teknologi, energi terbarukan, manufaktur, dan jasa. Negara ini adalah salah satu pemimpin dunia dalam hal energi angin dan teknologi hijau, dengan banyak perusahaan terkemuka yang berfokus pada inovasi dalam energi terbarukan. Selain itu, sektor manufaktur dan farmasi juga sangat maju, dengan perusahaan-perusahaan besar seperti Novo Nordisk yang menjadi pemain global dalam industri kesehatan.",
        products: [
            {icon:"🍖", description:"Hewani"}, 
            {icon:"🚜", description:"Pertanian"}, 
            {icon:"🧀", description:"Olahan Susu"}
        ],
        isEU: true
    },
    EE: {
        name: "Estonia",
        region: "northern",
        status: "developed",
        capital: "Tallinn",
        population: "1,3 juta",
        currency: "Euro (EUR)",
        language: "Estonia",
        flag: "https://flagcdn.com/ee.svg",
        description: "Salah satu kekuatan utama Estonia adalah sektor teknologi dan digital. Negara ini adalah pionir dalam hal inovasi digital dan pemerintahan elektronik (e-government). Estonia dikenal dengan sistem identitas digitalnya yang memungkinkan warga untuk melakukan berbagai layanan publik secara online, seperti pemilu elektronik dan administrasi pajak, yang telah mengurangi birokrasi dan meningkatkan efisiensi pemerintah. Keberhasilan ini telah menjadikan Estonia sebagai pusat teknologi di Eropa Timur, menarik banyak perusahaan teknologi dan startup.",
        products: [
            {icon:"💻", description:"Teknologi"}, 
            {icon:"🏝️", description:"Pariwisata"}, 
            {icon:"🪵", description:"Kayu"}
        ],
        isEU: true
    },
    FI: {
        name: "Finlandia",
        region: "northern",
        status: "developed",
        capital: "Helsinki",
        population: "5,5 juta",
        currency: "Euro (EUR)",
        language: "Finlandia, Swedia",
        flag: "https://flagcdn.com/fi.svg",
        description: "Negara ini memiliki ekonomi yang sangat inovatif, dengan sektor teknologi, manufaktur, energi, dan layanan yang berkembang pesat. Finlandia adalah rumah bagi perusahaan-perusahaan teknologi terkemuka seperti Nokia, meskipun negara ini kini semakin berfokus pada sektor teknologi tinggi dan startup digital, terutama di bidang kecerdasan buatan, teknologi hijau, dan kesehatan.",
        products: [
            {icon:"📱", description:"Teknologi"}, 
            {icon:"🏝️", description:"Pariwisata"},
        ],
        isEU: true
    },
    FR: {
        name: "Prancis",
        region: "western",
        status: "developed",
        capital: "Paris",
        population: "67 juta",
        currency: "Euro (EUR)",
        language: "Prancis",
        flag: "https://flagcdn.com/fr.svg",
        description: "Perusahaan-perusahaan besar seperti Airbus, Renault, dan L'Oréal, yang beroperasi di pasar global, adalah contoh keberhasilan sektor manufaktur dan konsumer di Prancis. Selain sektor industri, sektor jasa, terutama keuangan dan pariwisata, memainkan peran penting dalam perekonomian Prancis. Paris, sebagai salah satu pusat keuangan utama dunia, menarik investasi internasional dan merupakan tempat berkumpulnya banyak perusahaan multinasional. Sektor pariwisata juga sangat vital bagi ekonomi Prancis, dengan negara ini menjadi destinasi wisata paling banyak dikunjungi di dunia",
        products: [
            {icon:"🍷", description:"Anggur"}, 
            {icon:"🧀", description:"Olahan Susu"}, 
            {icon:"🗼", description:"Pariwisata"}
        ],
        isEU: true
    },
    DE: {
        name: "Jerman",
        region : "central",
        status : "developed",
        capital: "Berlin",
        population: "83 juta",
        currency: "Euro (EUR)",
        language: "Jerman",
        flag: "https://flagcdn.com/de.svg",
        description: "Sebagai negara dengan ekonomi terbesar di Eropa, Jerman memiliki industri yang sangat maju, dengan sektor-sektor utama seperti otomotif, mesin, elektronik, kimia, dan teknologi informasi. Perusahaan-perusahaan besar seperti Volkswagen, BMW, Siemens, menjadi pemain global dalam industri mereka masing-masing, yang menunjukkan betapa terdepan dan kompetitifnya sektor manufaktur di negara ini.",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"💻", description:"Teknologi"},
            {icon:"📺", description:"Elektronik"},
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: true
    },
    GR: {
        name: "Yunani",
        region: "southeastern",
        status: "developed",
        capital: "Athena",
        population: "10,7 juta",
        currency: "Euro (EUR)",
        language: "Yunani",
        flag: "https://flagcdn.com/gr.svg",
        description: "Perekonomian Yunani sangat bergantung pada sektor pariwisata, yang merupakan salah satu penyumbang terbesar dalam pendapatan negara. Selain itu, sektor pelayaran dan perkapalan juga sangat signifikan, karena Yunani memiliki armada kapal terbesar di dunia. Namun, meskipun sektor-sektor ini berkembang, perekonomian Yunani masih rentan terhadap krisis global dan ketergantungan pada sektor-sektor tersebut.",
        products: [
            {icon:"🫒", description:"Pertanian"},
            {icon:"🧵", description:"Tekstil"}, 
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: true
    },
    HU: {
        name: "Hungaria",
        region : "central",
        status: "developing",
        capital: "Budapest",
        population: "9,7 juta",
        currency: "Forint Hungaria (HUF)",
        language: "Hungaria",
        flag: "https://flagcdn.com/hu.svg",
        description: "Sektor pertanian memainkan peran penting dalam perekonomian Hungaria, meskipun kontribusinya terhadap PDB semakin berkurang seiring berjalannya waktu. Di samping itu, sektor jasa, terutama pariwisata dan keuangan, juga berkembang pesat, berkat kekayaan budaya dan sejarahnya yang menarik banyak pengunjung dari seluruh dunia. Budapest, ibu kota Hungaria, merupakan pusat wisata yang terkenal dengan arsitektur indah, kehidupan malam yang semarak, dan situs bersejarah.",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"🚜", description:"Pertanian"},
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    IS: {
        name: "Islandia",
        region: "northern",
        status: "developed",
        capital: "Reykjavik",
        population: "364.000",
        currency: "Króna Islandia (ISK)",
        language: "Islandia",
        flag: "https://flagcdn.com/is.svg",
        description: "Dalam hal ekonomi, meskipun Islandia menghadapi beberapa tantangan setelah krisis keuangan global 2008, negara ini telah berhasil pulih dengan cepat berkat sektor pariwisata, energi terbarukan, dan produk ekspor lainnya seperti ikan dan aluminium. Selain itu, Islandia juga memiliki sektor teknologi yang berkembang, dengan perusahaan-perusahaan startup yang inovatif di bidang bioteknologi dan teknologi informasi.",
        products: [
            {icon:"🐟", description:"Perikanan"}, 
            {icon:"💻", description:"Teknologi"},
            {icon:"🌄", description:"Pariwisata"}
        ],
        isEU: false
    },
    IE: {
        name: "Irlandia",
        region: "western",
        status: "developed",
        capital: "Dublin",
        population: "4,9 juta",
        currency: "Euro (EUR)",
        language: "Inggris, Irlandia",
        flag: "https://flagcdn.com/ie.svg",
        description: "Sektor teknologi di Irlandia berkembang pesat, dengan banyak perusahaan besar seperti Google, Facebook, dan Apple yang memiliki kantor pusat regional mereka di Dublin. Hal ini menjadikan Irlandia sebagai salah satu pusat inovasi teknologi terkemuka di Eropa. Selain itu, sektor farmasi dan bioteknologi juga memainkan peran penting, dengan banyak perusahaan besar yang memproduksi obat-obatan dan perangkat medis untuk pasar global.",
        products: [
            {icon:"💊", description:"Farmasi"}, 
            {icon:"🐄", description:"Hewani"},
            {icon:"💻", description:"Teknologi"},
        ],
        isEU: true
    },
    IT: {
        name: "Italia",
        region: "southern",
        status: "developed",
        capital: "Roma",
        population: "60 juta",
        currency: "Euro (EUR)",
        language: "Italia",
        flag: "https://flagcdn.com/it.svg",
        description: "Italia memiliki kekuatan utama dalam bidang manufaktur, terutama dalam industri otomotif. Negara ini adalah rumah bagi merek-merek terkenal seperti Ferrari, Fiat, Lamborghini, dan Ducati, serta merupakan pusat utama bagi industri fashion dengan kota-kota seperti Milan yang terkenal di seluruh dunia. Selain itu, Italia juga memiliki sektor makanan dan minuman yang sangat terkenal, dengan produk-produk seperti pasta, anggur, dan keju yang diekspor ke seluruh dunia. Pariwisata adalah salah satu pilar ekonomi utama Italia, berkat kekayaan sejarah, seni, dan arsitektur yang dimilikinya.",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"🏝️", description:"Pariwisata"},
            {icon:"👗", description:"Fashion"},
            {icon:"🍕", description:"Makanan"}
        ],
        isEU: true
    },
    LV: {
        name: "Latvia",
        region: "northern",
        status: "developing",
        capital: "Riga",
        population: "1,9 juta",
        currency: "Euro (EUR)",
        language: "Latvia",
        flag: "https://flagcdn.com/lv.svg",
        description: "Meskipun sektor teknologi dan sektor jasa, seperti perbankan dan IT, berkembang pesat, Latvia masih bergantung pada sektor tradisional seperti manufaktur dan transportasi yang rentan terhadap fluktuasi pasar global. Sebagian besar industri Latvia juga lebih fokus pada ekspor barang mentah atau produk yang memiliki nilai tambah lebih rendah dibandingkan dengan negara-negara maju yang lebih berorientasi pada inovasi dan produk bernilai tinggi.",
        products: [
            {icon:"🏝️", description:"Pariwisata"},
            {icon:"⚙️", description:"Manufaktur"},
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    LI: {
        name: "Liechtenstein",
        region : "central",
        status: "developed",
        capital: "Vaduz",
        population: "38.000",
        currency: "Franc Swiss (CHF)",
        language: "Jerman",
        flag: "https://flagcdn.com/li.svg",
        description: " Negara ini terkenal dengan sektor keuangan yang berkembang pesat, terutama dalam hal perbankan dan industri asuransi, yang telah menjadikannya pusat finansial global. Selain sektor keuangan, Liechtenstein juga memiliki sektor industri yang kuat, termasuk manufaktur produk tinggi seperti peralatan mekanik, jam tangan, dan barang-barang teknologi canggih.",
        products: [
            {icon:"📺", description:"Elaktronik"},
            {icon:"💰", description:"Jasa Keuangan"},
            {icon:"🐄", description:"Hewani"}
        ],
        isEU: false
    },
    LT: {
        name: "Lithuania",
        region: "northern",
        status: "developing",
        capital: "Vilnius",
        population: "2,8 juta",
        currency: "Euro (EUR)",
        language: "Lithuania",
        flag: "https://flagcdn.com/lt.svg",
        description: "Lithuania menghadapi beberapa tantangan yang menghalangi statusnya sebagai negara maju. Salah satunya adalah masalah ketergantungan pada sektor ekspor, terutama dalam industri elektronik, tekstil, dan produk pertanian, yang membuatnya rentan terhadap fluktuasi pasar global. Selain itu, meskipun ibu kota Vilnius dan beberapa kota besar lainnya berkembang pesat, wilayah pedesaan di Lithuania masih menghadapi tingkat pengangguran yang relatif tinggi dan masalah akses terhadap layanan publik seperti kesehatan dan pendidikan.",
        products: [
            {icon:"⚙️", description:"Manufaktur"},
            {icon:"🚜", description:"Pertanian"}
        ],
        isEU: true
    },
    LU: {
        name: "Luksemburg",
        region: "western",
        status: "developed",
        capital: "Luksemburg",
        population: "626.000",
        currency: "Euro (EUR)",
        language: "Luksemburg, Prancis, Jerman",
        flag: "https://flagcdn.com/lu.svg",
        description: " Negara ini dikenal sebagai pusat keuangan internasional, dengan sektor perbankan, asuransi, dan investasi yang sangat kuat. Luksemburg memiliki kebijakan perpajakan yang menguntungkan dan menawarkan lingkungan bisnis yang ramah, menarik banyak perusahaan besar dan institusi keuangan global untuk beroperasi di sana. Selain itu, sektor teknologi informasi dan komunikasi (TIK) juga berkembang pesat, menjadikannya sebagai hub untuk perusahaan-perusahaan teknologi dan inovasi digital.",
        products: [
            {icon:"💰", description:"Jasa Keuangan"},
            {icon:"💻", description:"Teknologi"}, 
            {Icon:"🏭", description:"Industri"},
            {icon:"🏰", description:"Pariwisata"}
        ],
        isEU: true
    },
    MT: {
        name: "Malta",
        region: "southern",
        status: "developed",
        capital: "Valletta",
        population: "514.000",
        currency: "Euro (EUR)",
        language: "Malta, Inggris",
        flag: "https://flagcdn.com/mt.svg",
        description: "Ekonomi Malta sangat bergantung pada sektor jasa, terutama sektor keuangan, pariwisata, dan teknologi informasi. Malta telah berhasil menarik banyak perusahaan internasional dengan kebijakan pajak yang menguntungkan, serta kemudahan berbisnis yang memungkinkan negara ini menjadi hub bisnis internasional, khususnya dalam sektor perbankan dan asuransi. Sektor pariwisata juga menjadi pendorong utama ekonomi Malta, dengan keindahan alam, warisan sejarah, dan iklim mediterania yang menarik jutaan wisatawan setiap tahun. Di samping itu, Malta memiliki sektor manufaktur yang berkembang, dengan fokus pada industri farmasi, elektronik, dan produk kimia yang bernilai tambah tinggi.",
        products: [
            {icon:"🏖️", description:"Pariwisata"},
            {icon:"💰", description:"Jasa Keungan"},
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    MD: {
        name: "Moldova",
        region: "eastern",
        status: "developing",
        capital: "Chișinău",
        population: "2,6 juta",
        currency: "Leu Moldova (MDL)",
        language: "Romania",
        flag: "https://flagcdn.com/md.svg",
        description: "Ekonomi Moldova adalah salah satu yang terkecil di Eropa, dengan ketergantungan besar pada sektor pertanian, terutama anggur, buah-buahan, dan sayuran sebagai komoditas ekspornya. Namun, ekonomi yang bergantung pada pertanian ini membuat Moldova sangat rentan terhadap perubahan iklim dan fluktuasi harga di pasar global.",
        products: [
            {icon:"🚜", description:"Pertanian"},
            {icon:"🏭", description:"Industri"}
        ],
        isEU: false
    },
    MC: {
        name: "Monako",
        region: "western",
        status: "developed",
        capital: "Monako",
        population: "39.000",
        currency: "Euro (EUR)",
        language: "Prancis",
        flag: "https://flagcdn.com/mc.svg",
        description: "Monako dikenal sebagai destinasi eksklusif dengan fasilitas mewah seperti kasino Monte Carlo dan Grand Prix Formula 1, yang menarik wisatawan berpenghasilan tinggi dari seluruh dunia. Pendapatan per kapita Monako termasuk salah satu yang tertinggi di dunia. Meskipun tidak memiliki sumber daya alam yang signifikan, Monako memanfaatkan posisinya di kawasan Riviera Prancis untuk mendukung ekonominya. Selain itu, pemerintah Monako telah berfokus pada keberlanjutan, termasuk proyek reklamasi laut dan pembangunan ramah lingkungan untuk menjaga daya tariknya sebagai negara kecil namun maju.",
        products: [
            {icon:"🏝️", description:"Pariwisata"},
            {icon:"💰", description:"Jasa Keuangan"}
        ],
        isEU: false
    },
    ME: {
        name: "Montenegro",
        region: "southeastern",
        status: "developing",
        capital: "Podgorica",
        population: "622.000",
        currency: "Euro (EUR)",
        language: "Montenegro",
        flag: "https://flagcdn.com/me.svg",
        description: "Salah satu alasan utamanya adalah skala ekonominya yang kecil dan tingkat pendapatan per kapita yang masih lebih rendah dibandingkan dengan negara-negara maju di Eropa. Ekonomi Montenegro sangat bergantung pada sektor pariwisata, terutama karena keindahan alamnya, seperti pantai di sepanjang Laut Adriatik dan kawasan pegunungan yang menarik wisatawan. Namun, ketergantungan yang besar pada sektor ini membuat ekonomi Montenegro rentan terhadap guncangan eksternal, seperti yang terlihat selama pandemi COVID-19.",
        products: [
            {icon:"🏖️", description:"Pariwisata"},
            {icon:"🏭", description:"Industri"}
        ],
        isEU: false
    },
    NL: {
        name: "Belanda",
        region: "western",
        status: "developed",
        capital: "Amsterdam",
        population: "17,4 juta",
        currency: "Euro (EUR)",
        language: "Belanda",
        flag: "https://flagcdn.com/nl.svg",
        description: "Sebagai pusat perdagangan internasional yang strategis, Belanda memiliki pelabuhan Rotterdam, salah satu pelabuhan tersibuk di dunia, dan bandara Schiphol yang menjadi hub utama di Eropa. Ekonomi Belanda didukung oleh sektor-sektor maju seperti agribisnis, teknologi, keuangan, energi, dan logistik, menjadikannya pemain kunci dalam perdagangan global.",
        products: [
            {icon:"💻", description:"Teknologi"},
            {icon:"🏝️", description:"Pariwisata"},
            {icon:"💰", description:"Jasa Keuangan"},
            {icon:"🚜", description:"Pertanian"}
        ],
        isEU: true
    },
    MK: {
        name: "Makedonia Utara",
        region: "southeastern",
        status: "developing",
        capital: "Skopje",
        population: "2,1 juta",
        currency: "Denar Makedonia (MKD)",
        language: "Makedonia",
        flag: "https://flagcdn.com/mk.svg",
        description: " Meskipun memiliki sektor pertanian, industri ringan, dan manufaktur sebagai pilar ekonominya, negara ini menghadapi tantangan besar dalam hal daya saing di pasar global. ",
        products: [
            {icon:"🚜", description:"Pertanian"},
            {icon:"🏭", description:"Industri"},
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: false
    },
    NO: {
        name: "Norwegia",
        region: "northern",
        status: "developed",
        capital: "Oslo",
        population: "5,4 juta",
        currency: "Krone Norwegia (NOK)",
        language: "Norwegia",
        flag: "https://flagcdn.com/no.svg",
        description: "Norwegia terkenal akan sumber daya alamnya. Mereka punya cadangan minyak dan gas alam yang besar, dan ekspor komoditas ini jadi penopang utama ekonomi mereka. Selain itu, Norwegia juga dikenal akan keindahan alamnya, jadi sektor pariwisata juga penting. Norwegia dikenal akan kualitas dan keberlanjutan indutri perikanan, negara ini merupakan produsen ikan Salmon terbesar di dunia, menyumbang sekitar 60% dari total produksi global.",
        products: [
            {icon:"🐟", description:"Perikanan"},
            {icon:"🛢️", description:"Minyak & Gas"},
            {icon:"⛷️", description:"Pariwisata"}
         ],
        isEU: false
    },
    PL: {
        name: "Polandia",
        region : "central",
        status: "developing",
        capital: "Warsawa",
        population: "38 juta",
        currency: "Złoty Polandia (PLN)",
        language: "Polandia",
        flag: "https://flagcdn.com/pl.svg",
        description: "Polandia termasuk dalam kategori negara maju, terutama setelah bergabung dengan Uni Eropa pada tahun 2004, yang menjadi katalis utama bagi pertumbuhan ekonomi dan modernisasi negara ini. Salah satu alasan utama status ini adalah pertumbuhan ekonomi yang konsisten selama beberapa dekade terakhir, didorong oleh sektor manufaktur, ekspor, dan integrasi dengan pasar global. Polandia juga memiliki infrastruktur yang berkembang pesat, termasuk jaringan transportasi dan fasilitas publik, berkat pendanaan Uni Eropa yang digunakan secara efektif untuk proyek pembangunan.",
        products: [
            {icon:"📺", description:"Elektronik"},
            {icon:"🚗", description:"Otomotif"},
            {icon:"🚜", description:"Pertanian"},
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    PT: {
        name: "Portugal",
        region: "southern",
        status: "developed",
        capital: "Lisbon",
        population: "10,3 juta",
        currency: "Euro (EUR)",
        language: "Portugis",
        flag: "https://flagcdn.com/pt.svg",
        description: "Portugal termasuk dalam kategori negara maju, tetapi posisinya dalam jajaran negara maju sering dianggap berada di tingkat yang lebih rendah dibandingkan negara-negara Uni Eropa lainnya. Salah satu alasan utama adalah stabilitas ekonomi yang telah dicapai melalui reformasi struktural dan dukungan dari Uni Eropa, meskipun negara ini masih menghadapi tantangan signifikan. Ekonomi Portugal sangat bergantung pada sektor pariwisata, yang memberikan kontribusi besar terhadap PDB tetapi membuat negara ini rentan terhadap guncangan global seperti pandemi. ",
        products: [
            {icon:"🚜", description:"Pertanian"},
            {icon:"⚙️", description:"Manufaktur"},
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: true
    },
    RO: {
        name: "Romania",
        region: "southeastern",
        status: "developing",
        capital: "Bucharest",
        population: "19,2 juta",
        currency: "Leu Romania (RON)",
        language: "Romania",
        flag: "https://flagcdn.com/ro.svg",
        description: "Rumania menghadapi tantangan seperti ketimpangan ekonomi antara wilayah perkotaan dan pedesaan, di mana daerah pedesaan sering kali kurang berkembang dalam hal infrastruktur, pendidikan, dan layanan kesehatan. Meskipun sektor teknologi informasi dan pariwisata berkembang pesat, ketergantungan pada sektor tradisional seperti pertanian dan manufaktur masih cukup besar.",
        products: [
            {icon:"⚙️", description:"Manufaktur"},
            {icon:"🚜", description:"Pertanian"},
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: true
    },
    RU: {
        name: "Rusia",
        region: "eastern",
        status: "developing",
        capital: "Moskow",
        population: "144,4 juta",
        currency: "Rubel Rusia (RUB)",
        language: "Rusia",
        flag: "https://flagcdn.com/ru.svg",
        description: "Rusia termasuk dalam kategori negara berkembang, meskipun memiliki pengaruh global yang besar dan merupakan salah satu ekonomi terbesar di dunia. Status ini disebabkan oleh berbagai faktor, termasuk ketergantungan ekonominya yang signifikan pada ekspor sumber daya alam, terutama minyak dan gas. Konflik dengan Ukraina jadi salah satu faktor yang membuat Rusia semakin sulit berkembang. Sanksi-sanksi ekonomi yang diberlakukan ke Rusia membuat perekonomian mereka makin terpuruk. Selain itu, konflik ini juga mengalihkan banyak sumber daya yang seharusnya digunakan untuk pembangunan dalam negeri.",
        products: [
            {icon:"🛢️", description:"Minyak & Gas"},
            {icon:"🌾", description:"Pertanian"},
            {icon:"⚙️", description:"Manufaktur"}
        ],
        isEU: false
    },
    SM: {
        name: "San Marino",
        region: "southern",
        status: "developed",
        capital: "San Marino",
        population: "35.000",
        currency: "Euro (EUR)",
        language: "Italia",
        flag: "https://flagcdn.com/sm.svg",
        description: "San Marino termasuk negara maju. Meskipun ukurannya kecil, mereka punya pendapatan per kapita yang tinggi. Ini karena sektor pariwisata yang maju dan kebijakan perpajakan yang menarik banyak perusahaan asing untuk beroperasi dinegara ini.",
        products: [
            {icon:"🏰", description:"Pariwisata"},
            {icon:"💰", description:"Jasa Keuangan"}
        ],
        isEU: false
    },
    RS: {
        name: "Serbia",
        region: "southeastern",
        status: "developing",
        capital: "Belgrade",
        population: "6,9 juta",
        currency: "Dinar Serbia (RSD)",
        language: "Serbia",
        flag: "https://flagcdn.com/rs.svg",
        description: "Serbia mengalami dampak besar dari konflik Yugoslavia dan sanksi internasional pada 1990-an, yang menyebabkan kehancuran ekonomi dan infrastruktur. Meskipun telah terjadi banyak pembangunan kembali, dampak tersebut masih terasa dalam bentuk ketertinggalan infrastruktur di beberapa wilayah. Namun, Serbia menunjukkan perkembangan positif. Sektor teknologi informasi (IT) sedang berkembang pesat, dan negara ini mulai menarik investasi asing di bidang manufaktur dan teknologi. Posisi geografisnya yang strategis di Eropa Selatan memberikan potensi besar untuk perdagangan dan integrasi ekonomi lebih lanjut.",
        products: [
            {icon:"🌾", description:"Pertanian"},
            {icon:"🏭", description:"Industri"},
            {icon:"🏝️", description:"Pariwisata"}
        ],
        isEU: false
    },
    SK: {
        name: "Slovakia",
        region : "central",
        status: "developed",
        capital: "Bratislava",
        population: "5,5 juta",
        currency: "Euro (EUR)",
        language: "Slovakia",
        flag: "https://flagcdn.com/sk.svg",
        description: "Ekonomi Slovakia sangat bergantung pada sektor industri, khususnya otomotif. Negara ini dikenal sebagai salah satu produsen mobil terbesar per kapita di dunia, dengan kehadiran perusahaan seperti Volkswagen, Kia, dan Peugeot. Selain itu, Slovakia juga memiliki sektor elektronik, teknologi informasi, dan pariwisata yang berkembang. ",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"💻", description:"Teknologi"},
            {icon:"🚜", description:"Pertanian"}
        ],
        isEU: true
    },
    SI: {
        name: "Slovenia",
        region : "central",
        status: "developed",
        capital: "Ljubljana",
        population: "2 juta",
        currency: "Euro (EUR)",
        language: "Slovenia",
        flag: "https://flagcdn.com/si.svg",
        description: "Ekonomi Slovenia didukung oleh sektor industri dan ekspor yang kuat, seperti otomotif, elektronik, farmasi. Letaknya yang strategis di Eropa Tengah menjadikannya pusat logistik penting untuk perdagangan regional dan internasional.",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"🏝️", description:"Pariwisata"},
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    ES: {
        name: "Spanyol",
        region: "southern",
        status: "developed",
        capital: "Madrid",
        population: "47 juta",
        currency: "Euro (EUR)",
        language: "Spanyol",
        flag: "https://flagcdn.com/es.svg",
        description: "Ekonomi Spanyol didukung oleh sektor pariwisata yang sangat maju, dengan negara ini menjadi salah satu tujuan wisata utama di dunia. Selain itu, sektor pertanian modern (seperti produksi anggur, buah-buahan, dan minyak zaitun), industri otomotif, serta jasa keuangan dan teknologi juga berkontribusi besar terhadap PDB-nya..",
        products: [
            {icon:"🚗", description:"Otomotif"},
            {icon:"🚜", description:"Pertanian"},
            {icon:"💻", description:"Teknologi"},
            {icon:"🏖️", description:"Pariwisata"}
        ],
        isEU: true
    },
    SE: {
        name: "Swedia",
        region: "northern",
        status: "developed",
        capital: "Stockholm",
        population: "10 juta",
        currency: "Krona Swedia (SEK)",
        language: "Swedia",
        flag: "https://flagcdn.com/se.svg",
        description: "Negara ini dikenal sebagai rumah bagi perusahaan multinasional besar seperti IKEA, Ericsson, Volvo, dan Spotify, yang menunjukkan keunggulan dalam inovasi teknologi dan sektor manufaktur. Swedia juga merupakan salah satu pemimpin dunia dalam transisi energi hijau, dengan sebagian besar energinya berasal dari sumber terbarukan, seperti tenaga air dan angin.",
        products: [
            {icon:"⚙️", description:"Manufaktur"},  
            {icon:"💻", description:"Teknologi"}
        ],
        isEU: true
    },
    CH: {
        name: "Swiss",
        region : "central",
        status: "developed",
        capital: "Bern",
        population: "8,6 juta",
        currency: "Franc Swiss (CHF)",
        language: "Jerman, Prancis, Italia, Romansh",
        flag: "https://flagcdn.com/ch.svg",
        description: "Negara ini juga dikenal karena sistem keuangan yang canggih, dengan sektor perbankan dan asuransi yang menjadi tulang punggung ekonominya. Swiss unggul dalam inovasi teknologi, farmasi, manufaktur mesin presisi, dan produk mewah seperti jam tangan, yang menjadi komoditas ekspor utamanya. Selain itu, fokus pada keberlanjutan dan kualitas hidup menjadikan Swiss salah satu negara dengan standar hidup tertinggi di dunia.",
        products: ["🏦", "🏝️", "⌚", "🪙"],
        isEU: false
    },
    UA: {
        name: "Ukraina",
        region: "eastern",
        status: "developing",
        capital: "Kyiv",
        population: "41 juta",
        currency: "Hryvnia Ukraina (UAH)",
        language: "Ukraina",
        flag: "https://flagcdn.com/ua.svg",
        description: "Negara terbesar kedua di Eropa dengan lahan pertanian yang luas. Termasuk dalam kategori negara berkembang karena beberapa faktor utama selain konflik dengan Rusia. Sistem perbankan Ukraina juga menghadapi masalah stabilitas, yang membuat investasi asing masuk secara terbatas. Konflik dengan Rusia semakin memperburuk kondisi ekonomi dan sosial negara ini, tetapi akar masalahnya terletak pada tantangan struktural yang sudah lama ada.",
        products: ["🌻", "🌾", "🚜", "🏭"],
        isEU: false
    },
    GB: {
        name: "Inggris",
        region: "western",
        status: "developed",
        region: "western",
        capital: "London",
        population: "68 juta",
        currency: "Pound Sterling (GBP)",
        language: "Inggris",
        flag: "https://flagcdn.com/gb.svg",
        description: "Inggris menghasilkan berbagai produk ekspor unggulan, seperti kendaraan bermotor, farmasi, mesin-mesin industri, teknologi canggih, dan produk keuangan. Selain itu, sektor jasa, termasuk pariwisata, perbankan, dan pendidikan internasional, berkontribusi signifikan terhadap perekonomian negara ini. Stabilitas politik, sistem hukum yang kuat, dan peran historisnya dalam perdagangan global menjadikan Inggris salah satu negara yang konsisten berada di jajaran negara maju.",
        products: ["💊", "🚗", "💰"],
        isEU: false
    },
    VA: {
        name: "Vatikan",
        region: "southern",
        status: "developed",
        capital: "Vatikan",
        population: "825",
        currency: "Euro (EUR)",
        language: "Italia, Latin",
        flag: "https://flagcdn.com/va.svg",
        description: "Vatikan termasuk dalam kategori negara maju, meskipun memiliki ukuran yang sangat kecil Vatikan memiliki pendapatan yang stabil melalui sumber ekonomi, seperti kontribusi dari umat Katolik di seluruh dunia (Peter’s Pence). Meskipun Vatikan tidak memiliki produk ekspor, kontribusinya dalam sektor pariwisata religius dan budaya sangat besar. Sebagai pusat spiritual Gereja Katolik, Vatikan menarik jutaan wisatawan dan peziarah setiap tahun ke Basilika Santo Petrus, Kapel Sistina, dan museum-museum bersejarahnya.",
        products: ["🕯️", "📿", "🎨", "📚"],
        isEU: false
    },
    GE: {
        name: "Georgia",
        region: "eastern",
        status: "developing",
        capital: "Tbilisi",
        population: "3,7 juta",
        currency: "Lari Georgia (GEL)",
        language: "Georgia",
        flag: "https://flagcdn.com/ge.svg",
        description: "Georgia masih masuk kategori negara berkembang meskipun memiliki lokasi strategis di persimpangan Eropa dan Asia karena beberapa faktor utama, seperti tantangan ekonomi yang signifikan, infrastruktur yang belum sepenuhnya berkembang, dan ketergantungan pada sektor ekonomi tertentu, seperti pertanian dan ekspor komoditas. Selain itu, meskipun ada upaya reformasi untuk meningkatkan perekonomian dan tata kelola pemerintahan, dampak konflik regional dan kurangnya investasi asing yang stabil masih menghambat kemajuan Georgia.",
        products: ["🍷", "🏔️", "🍇", "🛢️"],
        isEU: false
    },
    AZ: {
        name: "Azerbaijan",
        region: "eastern",
        status: "developing",
        capital: "Baku",
        population: "10,1 juta",
        currency: "Manat Azerbaijan (AZN)",
        language: "Azerbaijan",
        flag: "https://flagcdn.com/az.svg",
        description: "Merupakan salah satu negara di Kaukasus dengan kekayaan SDA melimpah terutama minyak dan gas alam. Meskipun punya banyak minyak dan gas, ekonomi mereka masih terlalu bergnatung pada sumber daya alam ini. Artinya, kalau harga minyak dunia lagi turun, perekonomian Azerbaijan bisa ikut terpengaruh. Juga karena pembangnan infrasturktur di beberapa daerah masih belum merata sehingga menyebabkan kesenjangan ekonomi antar daerah perkotaan dan pedesaan.",
        products: ["🛢️", "🌾", "🥜"],
        isEU: false
    },
    
};

