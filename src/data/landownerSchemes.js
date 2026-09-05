export const landownerSchemes = [
  {
    id: 'pm-kisan',
    name: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
      mr: 'पीएम-किसान (प्रधानमंत्री किसान सन्मान निधी)'
    },
    level: 'central',
    benefit: {
      en: '₹6,000/year direct cash transfer (3 installments of ₹2,000)',
      hi: '₹6,000/वर्ष प्रत्यक्ष नकद सहायता (₹2,000 की 3 किस्तों में)',
      mr: 'दरवर्षी ₹6,000 थेट बँक खात्यात (₹2,000 च्या 3 हप्त्यांमध्ये)'
    },
    evaluate: (answers) => {
      const hasPapers = answers.landPapers === 'yes';
      const hasAadhaar = answers.aadhaar === 'yes';
      const applied = answers.pmKisan === 'yes';

      if (hasPapers && hasAadhaar && applied) {
        return {
          status: 'qualify',
          why: {
            en: 'You have verified land records (7/12 extract) and your Aadhaar is DBT-linked with your bank account. You meet all primary criteria for receiving PM-KISAN cash installments.',
            hi: 'आपके पास अद्यतन भूमि दस्तावेज (7/12 उतारा) हैं और आपका आधार बैंक खाते से डीबीटी सक्षम है। आप पीएम-किसान की सभी पात्रता शर्तें पूरी करते हैं।',
            mr: 'तुमच्याकडे वैध 7/12 उतारा आहे आणि आधार बँक खात्याशी DBT द्वारे जोडलेले आहे. तुम्ही पीएम-किसानच्या सर्व प्राथमिक अटी पूर्ण करता.'
          },
          steps: {
            en: [
              'Visit your local CSC center or open pmkisan.gov.in on your phone.',
              'Check Beneficiary Status using your Aadhaar or registered mobile number.',
              'Ensure your e-KYC status shows Completed and Land Seeding is marked Yes.',
              'Next installment of ₹2,000 will be deposited directly to your bank.'
            ],
            hi: [
              'अपने नजदीकी सीएससी केंद्र पर जाएं या pmkisan.gov.in खोलें।',
              'अपने आधार या पंजीकृत मोबाइल नंबर से Beneficiary Status जांचें।',
              'जांचें कि ई-केवाईसी पूर्ण है और लैंड सीडिंग Yes है।',
              'अगली ₹2,000 की किस्त सीधे आपके बैंक खाते में जमा कर दी जाएगी।'
            ],
            mr: [
              'आपल्या जवळच्या CSC केंद्रात जा किंवा pmkisan.gov.in संकेतस्थळ उघडा.',
              'आपला आधार क्रमांक वापरून Beneficiary Status तपासा.',
              'तुमचे e-KYC पूर्ण झाले आहे आणि लँड सीडिंग Yes आहे याची खात्री करा.',
              'पुढील ₹2,000 चा हप्ता थेट तुमच्या बँक खात्यात जमा केला जाईल.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'You may be missing out! Either Aadhaar is not seeded for DBT, your 7/12 land record needs digital verification, or your initial application is pending.',
            hi: 'आप ₹6,000 के लाभ से चूक रहे हो सकते हैं! या तो बैंक में आधार डीबीटी लिंक नहीं है, 7/12 रिकॉर्ड सत्यापित नहीं है, या आपने अभी तक आवेदन नहीं किया है।',
            mr: 'तुम्ही वर्षाला मिळणाऱ्या ₹6,000 लाभापासून वंचित राहू शकता! बँक खात्याशी आधार DBT लिंक नसणे किंवा 7/12 उतारा पडताळणी प्रलंबित असणे हे कारण असू शकते.'
          },
          steps: {
            en: [
              'Visit your bank branch and submit the Aadhaar NPCI DBT Seeding Form.',
              'Get an updated digital 7/12 extract from Mahabhumi portal.',
              'Go to your village Talathi or nearest CSC to complete new farmer registration.',
              'Complete facial or biometric e-KYC on the PM-KISAN mobile app.'
            ],
            hi: [
              'अपनी बैंक शाखा में जाएं और आधार एनपीसीआई डीबीटी सीडिंग फॉर्म जमा करें।',
              'महाभूमि पोर्टल से अद्यतन डिजिटल 7/12 उतारा प्राप्त करें।',
              'नए किसान पंजीकरण के लिए अपने ग्राम तलाठी या नजदीकी सीएससी केंद्र पर जाएं।',
              'पीएम-किसान मोबाइल ऐप पर बायोमेट्रिक या ओटीपी ई-केवाईसी पूरी करें।'
            ],
            mr: [
              'आपल्या बँकेच्या शाखेत जाऊन आधार NPCI DBT सीडिंग फॉर्म भरून द्या.',
              'महाभूमी पोर्टलवरून डिजिटल स्वाक्षरी असलेला 7/12 उतारा मिळवा.',
              'नवीन नोंदणीसाठी गावातील तलाठी किंवा जवळच्या महा-ई-सेवा केंद्रात संपर्क साधा.',
              'पीएम-किसान मोबाईल ॲपवर जाऊन मोफत e-KYC पूर्ण करा.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'namo-shetkari',
    name: {
      en: 'Namo Shetkari Maha Samman Nidhi Yojana',
      hi: 'नमो शेतकरी महा सन्मान निधि योजना',
      mr: 'नमो शेतकरी महा सन्मान निधी योजना'
    },
    level: 'state',
    benefit: {
      en: '₹6,000/year state cash top-up (Total ₹12,000/yr combined with PM-KISAN)',
      hi: '₹6,000/वर्ष राज्य सरकार की अतिरिक्त सहायता (कुल ₹12,000/वर्ष)',
      mr: 'महाराष्ट्र शासनाकडून दरवर्षी ₹6,000 अतिरिक्त मदत (एकूण ₹12,000/वर्ष)'
    },
    evaluate: (answers) => {
      const isMH = (answers.state || 'Maharashtra').toLowerCase().includes('maharashtra');
      const hasPapers = answers.landPapers === 'yes';
      const hasAadhaar = answers.aadhaar === 'yes';

      if (isMH && hasPapers && hasAadhaar) {
        return {
          status: 'qualify',
          why: {
            en: 'Since you are farming in Maharashtra with valid land records, you qualify for this state top-up scheme which matches PM-KISAN with an extra ₹6,000 annually.',
            hi: 'चूंकि आप महाराष्ट्र में भूमिधारक किसान हैं, आप राज्य सरकार की इस टॉप-अप योजना के पात्र हैं, जिससे आपकी वार्षिक सहायता ₹12,000 हो जाती है।',
            mr: 'तुम्ही महाराष्ट्रातील जमीनधारक शेतकरी असल्याने, राज्य शासनाच्या या योजनेनुसार तुम्हाला केंद्र सरकारप्रमाणेच अतिरिक्त ₹6,000 मिळण्यास पात्र आहात.'
          },
          steps: {
            en: [
              'No separate state application is required if your PM-KISAN registration is active.',
              'Verify your Maharashtra Agriculture Department seeding on mahakisan.gov.in.',
              'Ensure your bank account has active SMS alerts for state DBT credits.'
            ],
            hi: [
              'यदि आपका पीएम-किसान पंजीकरण सक्रिय है तो अलग से आवेदन की आवश्यकता नहीं है।',
              'mahadbt.maharashtra.gov.in पर अपने आधार लिंकिंग की पुष्टि करें।',
              'बैंक खाते में सक्रिय एसएमएस अलर्ट सुनिश्चित करें ताकि किस्त आने पर सूचना मिले।'
            ],
            mr: [
              'तुमची पीएम-किसान नोंदणी वैध असल्यास वेगळा अर्ज करण्याची गरज नाही.',
              'महाडीबीटी पोर्टलवर जाऊन आपले आधार मॅपिंग तपासून घ्या.',
              'शासनाकडून हप्ता जमा होताच बँकेकडून SMS प्राप्त होईल याची खात्री करा.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'Namo Shetkari benefits require an approved PM-KISAN profile and active Aadhaar DBT link in Maharashtra.',
            hi: 'इस योजना का लाभ पाने के लिए पीएम-किसान में स्वीकृत प्रोफ़ाइल और महाराष्ट्र में बैंक आधार लिंक होना अनिवार्य है।',
            mr: 'या योजनेचा लाभ मिळवण्यासाठी पीएम-किसान खात्यातील त्रुटी दूर करणे व आधार बँक खात्याशी जोडणे आवश्यक आहे.'
          },
          steps: {
            en: [
              'First resolve any pending issues on PM-KISAN central portal.',
              'Ensure land 7/12 is linked to your Aadhaar card number.',
              'Contact your local Gram Panchayat Krishi Sahayak for verification.'
            ],
            hi: [
              'पहले पीएम-किसान पोर्टल पर अपनी रुकी हुई किस्तों का समाधान करें।',
              'सुनिश्चित करें कि जमीन का 7/12 उतारा आपके आधार नंबर से जुड़ा हुआ है।',
              'सत्यापन के लिए अपनी ग्राम पंचायत के कृषि सहायक से संपर्क करें।'
            ],
            mr: [
              'प्रथम पीएम-किसान पोर्टलवरील प्रलंबित त्रुटींची दुरुस्ती करा.',
              'तुमचा 7/12 उतारा आणि आधार क्रमांक जोडलेला असल्याची खात्री करा.',
              'मार्गदर्शनासाठी गावच्या कृषी सहाय्यक किंवा ग्रामसेवकांशी संपर्क साधा.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'pmfby',
    name: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      mr: 'प्रधानमंत्री पीक विमा योजना (PMFBY - १ रुपयात पीक विमा)'
    },
    level: 'central',
    benefit: {
      en: 'Full crop loss compensation; in Maharashtra farmers pay only ₹1 token premium',
      hi: 'प्राकृतिक आपदाओं से संपूर्ण फसल सुरक्षा; महाराष्ट्र में केवल ₹1 टोकन प्रीमियम पर',
      mr: 'नैसर्गिक आपत्तींपासून संपूर्ण पीक संरक्षण; महाराष्ट्रात फक्त ₹1 भरून पीक विमा'
    },
    evaluate: (answers) => {
      const hasInsurance = answers.insurance === 'yes';
      if (hasInsurance) {
        return {
          status: 'qualify',
          why: {
            en: 'You already have active crop insurance. Continue renewing before the seasonal cut-off date (Kharif/Rabi) to keep your fields protected.',
            hi: 'आपकी फसलों का पहले से बीमा है। खरीफ और रबी सीजन की अंतिम तिथि से पहले हर बार इसका नवीनीकरण सुनिश्चित करें।',
            mr: 'तुमच्या पिकांना आधीच विमा संरक्षण आहे. प्रत्येक हंगामात वेळेवर नूतनीकरण करून संरक्षण कायम ठेवा.'
          },
          steps: {
            en: [
              'Keep your crop insurance policy receipt and application number safe.',
              'In case of localized storm or flood damage, report within 72 hours via Crop Insurance mobile app.',
              'Toll-free crop loss helpline: 1800-200-5142.'
            ],
            hi: [
              'अपनी फसल बीमा पावती और पॉलिसी नंबर हमेशा सुरक्षित रखें।',
              'ओलावृष्टि या भारी बारिश से नुकसान होने पर 72 घंटे के भीतर Crop Insurance ऐप पर सूचना दर्ज करें।',
              'नुकसान दर्ज कराने हेतु टोल-फ्री हेल्पलाइन 1800-200-5142 पर संपर्क करें।'
            ],
            mr: [
              'आपली पीक विमा पावती आणि ॲप्लिकेशन क्रमांक जपून ठेवा.',
              'अतिवृष्टी किंवा गारपिटीमुळे नुकसान झाल्यास 72 तासांच्या आत Crop Insurance ॲपवर तक्रार नोंदवा.',
              'नुकसानीची तक्रार नोंदवण्यासाठी टोल-फ्री क्रमांक 1800-200-5142 वर संपर्क करा.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'You are currently bearing 100% financial risk against unseasonal rain, drought, and pest attacks. In Maharashtra, you can insure crops for just ₹1!',
            hi: 'आप बेमौसम बारिश और सूखे का पूरा आर्थिक जोखिम खुद उठा रहे हैं। महाराष्ट्र में केवल ₹1 देकर आप अपनी फसल का पूरा बीमा करवा सकते हैं!',
            mr: 'अवकाळी पाऊस किंवा दुष्काळामुळे होणारे नुकसान तुम्ही स्वतः सहन करत आहात. महाराष्ट्रात फक्त ₹1 भरून तुम्ही संपूर्ण पिकाला विमा संरक्षण मिळवू शकता!'
          },
          steps: {
            en: [
              'Visit your nearest CSC center or bank branch with your 7/12 extract, sowing certificate, and Aadhaar.',
              'Opt-in on the national PMFBY portal (pmfby.gov.in) before the seasonal notification deadline.',
              'Pay the ₹1 token fee and collect your official policy receipt.'
            ],
            hi: [
              'अपने 7/12 उतारा, बोवनी प्रमाण पत्र और आधार कार्ड के साथ सीएससी केंद्र जाएं।',
              'अंतिम तिथि से पहले pmfby.gov.in पर ऑनलाइन या बैंक में फॉर्म भरें।',
              'मात्र ₹1 का टोकन शुल्क दें और आधिकारिक बीमा पावती प्राप्त करें।'
            ],
            mr: [
              'आपला 7/12 उतारा, पिकांची पेरणी नोंद आणि आधार घेऊन महा-ई-सेवा केंद्रात जा.',
              'अंतिम मुदतीपूर्वी pmfby.gov.in पोर्टलवर अर्ज सादर करा.',
              'फक्त ₹1 चे टोकन शुल्क भरून अधिकृत विमा पावती नक्की मिळवा.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'kcc',
    name: {
      en: 'Kisan Credit Card (KCC) Scheme',
      hi: 'किसान क्रेडिट कार्ड (KCC) योजना',
      mr: 'किसान क्रेडिट कार्ड (KCC) योजना'
    },
    level: 'central',
    benefit: {
      en: 'Low-interest crop loan up to ₹3 Lakh at 4% effective interest rate with prompt repayment',
      hi: '₹3 लाख तक का सस्ता फसल ऋण मात्र 4% प्रभावी ब्याज दर पर (समय पर चुकाने पर)',
      mr: 'वेळेवर परतफेड केल्यास फक्त 4% सवलतीच्या व्याजदराने ₹3 लाखांपर्यंत पीक कर्ज'
    },
    evaluate: (answers) => {
      const hasKCC = answers.kcc === 'yes';
      if (hasKCC) {
        return {
          status: 'qualify',
          why: {
            en: 'You hold a KCC! By repaying before the annual renewal date, you get a 3% prompt repayment incentive, reducing your interest to just 4%.',
            hi: 'आपके पास केसीसी है! समय पर ऋण चुकाने से आपको 3% की अतिरिक्त छूट मिलती है और प्रभावी ब्याज केवल 4% रह जाता है।',
            mr: 'तुमच्याकडे KCC आहे! कर्जाची वेळेवर परतफेड करून 3% व्याज सवलतीचा लाभ घ्या, ज्यामुळे व्याजदर फक्त 4% राहतो.'
          },
          steps: {
            en: [
              'Renew your credit limit annually at your bank to avoid penalties.',
              'Use KCC Rupay card at rural ATMs or POS machines for seeds and fertilizer purchases.',
              'Check if your card limit can be increased based on new crop scale of finance.'
            ],
            hi: [
              'जुर्माने से बचने के लिए हर साल बैंक जाकर अपनी क्रेडिट सीमा का नवीनीकरण कराएं।',
              'खाद और बीज खरीदने के लिए अपने केसीसी रुपे कार्ड का उपयोग करें।',
              'बैंक प्रबंधक से मिलकर नई फसल लागत के अनुसार ऋण सीमा बढ़वाने का अनुरोध करें।'
            ],
            mr: [
              'दंड टाळण्यासाठी दरवर्षी बँकेत जाऊन आपल्या KCC मर्यादेचे नूतनीकरण करा.',
              'खते आणि बियाणे खरेदीसाठी KCC RuPay कार्डचा वापर करा.',
              'नव्या पीक कर्जाच्या स्केल ऑफ फायनान्सनुसार मर्यादेत वाढ करून घ्या.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'You are not using KCC and might be forced to borrow from local lenders at 24%-36% interest. You qualify for institutional credit at just 4%!',
            hi: 'आप केसीसी का लाभ नहीं ले रहे हैं और साहूकारों से 24-36% के भारी ब्याज पर ऋण लेने को मजबूर हो सकते हैं। आप बैंक से 4% पर ऋण के पात्र हैं!',
            mr: 'तुमच्याकडे KCC नसल्याने तुम्हाला खाजगी सावकारांकडून जादा व्याजाने कर्ज घ्यावे लागू शकते. तुम्ही फक्त 4% व्याजदराने बँक कर्जासाठी पात्र आहात!'
          },
          steps: {
            en: [
              'Collect a 1-page simplified KCC application form from your nearest bank.',
              'Attach copy of digital 7/12, Aadhaar, PAN card, and passport photos.',
              'Banks are mandated to process KCC applications within 14 working days without collateral up to ₹1.6 Lakh.'
            ],
            hi: [
              'अपने नजदीकी राष्ट्रीयकृत या ग्रामीण बैंक से 1 पेज का सरल KCC फॉर्म लें।',
              'साथ में डिजिटल 7/12 उतारा, आधार कार्ड, पैन कार्ड और 2 फोटो लगाएं।',
              'बैंक ₹1.6 लाख तक बिना किसी बंधक के 14 दिनों में कार्ड जारी करने के लिए बाध्य हैं।'
            ],
            mr: [
              'जवळच्या राष्ट्रीयकृत किंवा सहकारी बँकेतून KCC चा साधा फॉर्म घ्या.',
              'सोबत 7/12 उतारा, 8-अ उतारा, आधार कार्ड व फोटो जोडा.',
              '₹1.60 लाखांपर्यंतच्या कर्जासाठी कोणतीही गहाण खत न करता 14 दिवसांत कर्ज देणे बँकेला बंधनकारक आहे.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'pm-kusum',
    name: {
      en: 'PM-KUSUM (Solar Agricultural Pump Subsidy)',
      hi: 'पीएम-कुसुम (सोलर कृषि पंप अनुदान योजना)',
      mr: 'पीएम-कुसुम योजना (सौर कृषी पंप 90% अनुदान)'
    },
    level: 'central',
    benefit: {
      en: 'Up to 90% subsidy for installing 3HP, 5HP or 7.5HP Solar Water Pumps for farm irrigation',
      hi: 'खेती की सिंचाई के लिए सोलर पंप लगवाने पर सरकार की ओर से 90% तक की भारी सब्सिडी',
      mr: 'शेतीच्या सिंचनासाठी 3HP, 5HP किंवा 7.5HP सौर कृषी पंपावर 90% पर्यंत शासकीय अनुदान'
    },
    evaluate: (answers) => {
      const landSize = parseFloat(answers.landSize || 0);
      const hasPapers = answers.landPapers === 'yes';

      if (hasPapers && landSize >= 1) {
        return {
          status: 'qualify',
          why: {
            en: 'You have verified farmland of 1+ acre. You qualify for a stand-alone Solar Agricultural Pump under Component-B with 90% government subsidy.',
            hi: 'आपके पास 1 एकड़ से अधिक जमीन और भू-अभिलेख उपलब्ध हैं। आप 90% सब्सिडी के साथ सोलर पंप लगवाने के लिए पूर्णतः पात्र हैं।',
            mr: 'तुमच्याकडे 1 एकरपेक्षा जास्त शेतजमीन व वैध कागदपत्रे आहेत. तुम्ही 90% अनुदानावर सौर कृषी पंप मिळवण्यासाठी पूर्णतः पात्र आहात.'
          },
          steps: {
            en: [
              'Visit the Maharashtra MEDA portal (kusum.mahaurja.com).',
              'Upload 7/12 extract showing water source and Aadhaar.',
              'Pay your 10% farmer share (remaining 90% is borne by Central + State government).',
              'Authorized vendor installs solar panels, inverter, and submersible pump at your farm.'
            ],
            hi: [
              'महाऊर्जा / महावितरण पोर्टल (kusum.mahaurja.com) पर जाएं।',
              'जल स्रोत दर्शाने वाला 7/12 उतारा और आधार अपलोड करें।',
              'किसान के हिस्से का 10% शुल्क जमा करें (बाकी 90% खर्च सरकार उठाएगी)।',
              'अधिकृत एजेंसी आपके खेत पर सोलर पंप स्थापित करेगी।'
            ],
            mr: [
              'महाऊर्जा किंवा महावितरणच्या अधिकृत पोर्टलवर नोंदणी करा.',
              'विहीर किंवा बोअरवेल पाण्याची नोंद असलेला 7/12 व आधार जोडा.',
              'शेतकऱ्याचा 10% हिस्सा भरा (उर्वरित 90% रक्कम शासन देईल).',
              'कंपनीचे तंत्रज्ञ थेट शेतात येऊन सोलर पंप बसवून देतील.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'Solar pump subsidies require verified landholding and proof of a valid water source (well, borewell, farm pond) on the 7/12 extract.',
            hi: 'सोलर पंप अनुदान के लिए भू-अभिलेख और 7/12 में जल स्रोत (कुआं/बोरवेल) की प्रविष्टि होना जरूरी है।',
            mr: 'सौर पंपासाठी जमिनीच्या 7/12 उताऱ्यावर विहीर, शेततळे किंवा बोअरवेल या जलस्रोताची नोंद असणे आवश्यक आहे.'
          },
          steps: {
            en: [
              'Get your irrigation source officially registered in revenue records with your Talathi.',
              'Form a joint farmer user group if your personal landholding is small.',
              'Apply online under PM-KUSUM when the district quota application window opens.'
            ],
            hi: [
              'अपने तलाठी के माध्यम से 7/12 में कुएं या जल स्रोत की प्रविष्टि दर्ज कराएं।',
              'यदि जमीन कम है तो पड़ोसी किसानों के साथ मिलकर समूह आवेदन कर सकते हैं।',
              'जिला कोटा खुलने पर महाऊर्जा पोर्टल पर ऑनलाइन आवेदन करें।'
            ],
            mr: [
              'तलाठ्यांशी संपर्क साधून 7/12 उताऱ्यावर आपल्या जलस्रोताची नोंद करून घ्या.',
              'जमीन कमी असल्यास लगतच्या शेतकऱ्यांसोबत गट-शेती तत्त्वावर अर्ज करता येतो.',
              'जिल्ह्याचा कोटा उपलब्ध होताच महाऊर्जा संकेतस्थळावर अर्ज दाखल करा.'
            ]
          }
        };
      }
    }
  }
];
