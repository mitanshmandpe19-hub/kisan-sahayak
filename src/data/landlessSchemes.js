export const landlessSchemes = [
  {
    id: 'eshram',
    name: {
      en: 'e-Shram Registration & Social Security',
      hi: 'ई-श्रम कार्ड एवं सामाजिक सुरक्षा योजना',
      mr: 'ई-श्रम नोंदणी व सामाजिक सुरक्षा योजना'
    },
    level: 'central',
    benefit: {
      en: 'Universal UAN Card + ₹2,00,000 accidental death cover + direct DBT disaster relief',
      hi: 'राष्ट्रीय श्रमिक कार्ड + ₹2,00,000 का निःशुल्क दुर्घटना बीमा + संकट में सीधी आर्थिक सहायता',
      mr: 'राष्ट्रीय UAN ओळखपत्र + ₹2,00,000 मोफत अपघात विमा + थेट आर्थिक मदत'
    },
    evaluate: (answers) => {
      const hasEshram = answers.eshram === 'yes';

      if (hasEshram) {
        return {
          status: 'qualify',
          why: {
            en: 'You are already an e-Shram cardholder! You are entitled to ₹2 Lakh accidental insurance under PMSBY and prioritized for central welfare assistance.',
            hi: 'आपके पास पहले से ई-श्रम कार्ड है! आप ₹2 लाख के दुर्घटना बीमा के हकदार हैं और संकट राहत के लिए प्राथमिकता सूची में शामिल हैं।',
            mr: 'तुमच्याकडे आधीच ई-श्रम कार्ड आहे! तुम्हाला ₹2 लाख रुपयांचे मोफत अपघात विमा संरक्षण असून शासनाच्या थेट मदत योजनांसाठी तुम्ही पात्र आहात.'
          },
          steps: {
            en: [
              'Keep your 12-digit e-Shram UAN card downloaded and saved on your phone.',
              'Verify on eshram.gov.in that your bank account details and current address are up to date.',
              'Nominate a family member for accidental insurance benefits.'
            ],
            hi: [
              'अपना 12 अंकों का ई-श्रम कार्ड मोबाइल में डाउनलोड करके सुरक्षित रखें।',
              'eshram.gov.in पर जाकर जांचें कि आपका बैंक खाता और पता सही दर्ज है।',
              'बीमा लाभ के लिए परिवार के किसी सदस्य का नॉमिनी नाम अवश्य जुड़वाएं।'
            ],
            mr: [
              'आपले 12 अंकी e-Shram ओळखपत्र मोबाईलमध्ये सेव्ह ठेवा.',
              'eshram.gov.in वर जाऊन बँक खाते आणि पत्ता अद्ययावत असल्याची खात्री करा.',
              'विमा लाभासाठी कुटुंबातील वारसाचे (नॉमिनी) नाव नोंदवून ठेवा.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'You are missing out on free ₹2,00,000 accidental insurance cover and central social security protections available to all unorganized farm workers.',
            hi: 'आप ₹2,00,000 के निःशुल्क दुर्घटना बीमा और कृषि मजदूरों के लिए केंद्र सरकार की सामाजिक सुरक्षा योजनाओं से वंचित हैं।',
            mr: 'तुम्ही ₹2,00,000 चे मोफत अपघात विमा संरक्षण आणि असंघटित शेतमजुरांसाठी असलेल्या थेट शासकीय लाभांपासून वंचित आहात.'
          },
          steps: {
            en: [
              'Registration is 100% free! Visit eshram.gov.in or your local CSC center.',
              'All you need is your Aadhaar number, Aadhaar-linked mobile, and bank account passbook.',
              'Instant download of your National e-Shram UAN Card.'
            ],
            hi: [
              'पंजीकरण बिल्कुल मुफ्त है! eshram.gov.in खोलें या नजदीकी सीएससी केंद्र जाएं।',
              'केवल अपना आधार नंबर, मोबाइल और बैंक पासबुक साथ रखें।',
              'तुरंत अपना 12 अंकों का राष्ट्रीय ई-श्रम कार्ड डाउनलोड करें।'
            ],
            mr: [
              'ई-श्रम नोंदणी पूर्णपणे मोफत आहे! जवळच्या महा-ई-सेवा केंद्रात जा.',
              'फक्त आधार कार्ड, मोबाईल नंबर आणि बँक पासबुकची आवश्यकता आहे.',
              'नोंदणी होताच तात्काळ 12 अंकी राष्ट्रीय ई-श्रम कार्ड प्राप्त होते.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'mgnrega',
    name: {
      en: 'MGNREGA Guaranteed Rural Employment',
      hi: 'मनरेगा (MGNREGA) 100 दिन गारंटी रोजगार',
      mr: 'मनरेगा (MGNREGA) १०० दिवस हमी रोजगार योजना'
    },
    level: 'central',
    benefit: {
      en: 'Guaranteed 100 days of paid wage employment per household per year (approx ₹273 - ₹300+/day)',
      hi: 'प्रत्येक ग्रामीण परिवार को साल में 100 दिन के कानूनी रोजगार की गारंटी (दैनिक मजदूरी बैंक में)',
      mr: 'प्रत्येक ग्रामीण कुटुंबाला वर्षाला १०० दिवस हक्काचा रोजगार (दैनिक मजुरी थेट बँक खात्यात)'
    },
    evaluate: (answers) => {
      const hasJobCard = answers.mgnrega === 'yes';

      if (hasJobCard) {
        return {
          status: 'qualify',
          why: {
            en: 'You have an MGNREGA Job Card! You have a legal right to demand work within 15 days of application, or receive an unemployment allowance.',
            hi: 'आपके पास मनरेगा जॉब कार्ड है! आपको मांग करने के 15 दिनों के भीतर काम पाने का कानूनी अधिकार है, अन्यथा बेरोजगारी भत्ता मिलता है।',
            mr: 'तुमच्याकडे मनरेगा जॉब कार्ड आहे! कामाची मागणी केल्यापासून 15 दिवसांत काम मिळण्याचा किंवा बेरोजगारी भत्ता मिळण्याचा तुम्हाला कायदेशीर हक्क आहे.'
          },
          steps: {
            en: [
              'Submit a written application (Form 6) for work to your Gram Panchayat / Gram Rozgar Sahayak.',
              'Obtain a dated receipt for your work application.',
              'Wages are transferred directly to your Aadhaar-linked bank account within 15 days.'
            ],
            hi: [
              'अपनी ग्राम पंचायत या ग्राम रोजगार सहायक को काम की मांग का आवेदन पत्र दें।',
              'अपने आवेदन की दिनांकित पावती अवश्य लें।',
              'काम पूरा होने के 15 दिनों के भीतर मजदूरी सीधे आपके बैंक खाते में भेजी जाएगी।'
            ],
            mr: [
              'आपल्या ग्रामपंचायतीमध्ये किंवा ग्राम रोजगार सेवकाकडे कामाची मागणी करणारा अर्ज द्या.',
              'अर्जाची तारीख असलेली पोचपावती अवश्य घ्या.',
              '15 दिवसांत मजुरी थेट तुमच्या आधार लिंक बँक खात्यात जमा होते.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'Without a Job Card, you cannot claim 100 days of legally guaranteed wage employment during the agricultural off-season.',
            hi: 'जॉब कार्ड न होने के कारण आप गैर-खेती के मौसम में 100 दिन के कानूनी रोजगार गारंटी का लाभ नहीं ले पा रहे हैं।',
            mr: 'जॉब कार्ड नसल्यामुळे शेती नसलेल्या हंगामात तुम्हाला 100 दिवसांच्या हमी रोजगाराचा कायदेशीर अधिकार मिळत नाही.'
          },
          steps: {
            en: [
              'Visit your local Gram Panchayat office with Aadhaar cards and photos of adult family members.',
              'Fill the simple Job Card Application Form (completely free).',
              'The Gram Panchayat is legally required to issue your Job Card within 15 days.'
            ],
            hi: [
              'परिवार के सभी वयस्क सदस्यों के आधार कार्ड और फोटो लेकर ग्राम पंचायत कार्यालय जाएं।',
              'निःशुल्क जॉब कार्ड आवेदन पत्र भरें।',
              'कानूनन ग्राम पंचायत को 15 दिनों के भीतर जॉब कार्ड जारी करना अनिवार्य है।'
            ],
            mr: [
              'कुटुंबातील सर्व सज्ञान सदस्यांचे आधार कार्ड व फोटो घेऊन ग्रामपंचायत कार्यालयात जा.',
              'जॉब कार्डसाठी विनामूल्य अर्ज भरा.',
              'ग्रामपंचायतीने अर्ज केल्यापासून 15 दिवसांच्या आत जॉब कार्ड देणे बंधनकारक आहे.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'pm-sym',
    name: {
      en: 'PM-SYM Pension (Pradhan Mantri Shram Yogi Maandhan)',
      hi: 'प्रधानमंत्री श्रम योगी मानधन (PM-SYM) पेंशन योजना',
      mr: 'प्रधानमंत्री श्रमयोगी मानधन (PM-SYM) पेन्शन योजना'
    },
    level: 'central',
    benefit: {
      en: 'Guaranteed lifelong pension of ₹3,000/month after age 60 with 50% govt matching contribution',
      hi: '60 वर्ष की आयु के बाद ₹3,000/माह की आजीवन गारंटीड पेंशन (50% अंशदान सरकार देती है)',
      mr: 'वयाच्या ६० वर्षांनंतर दरमहा ₹3,000 ची खात्रीशीर पेन्शन (50% हप्ता सरकार भरते)'
    },
    evaluate: (answers) => {
      const age = parseInt(answers.age || '30', 10);
      const hasBank = answers.ownBank === 'yes';

      if (age >= 18 && age <= 40 && hasBank) {
        return {
          status: 'qualify',
          why: {
            en: 'You are within the 18-40 age bracket and earn under ₹15,000/month. By investing just ₹55 - ₹200/month (matched equally by the Central Govt), you secure a dignified ₹3,000/month retirement pension.',
            hi: 'आपकी उम्र 18 से 40 वर्ष के बीच है। मात्र ₹55 से ₹200 प्रति माह जमा करके (इतनी ही राशि केंद्र सरकार भी मिलाएगी), आप वृद्धावस्था में ₹3,000 प्रति माह पेंशन के हकदार बन सकते हैं।',
            mr: 'तुमचे वय 18 ते 40 दरम्यान आहे. दरमहा फक्त ₹55 ते ₹200 भरून (तितकाच हिस्सा केंद्र सरकार भरेल), तुम्हाला वयाच्या ६० नंतर दरमहा ₹3,000 खात्रीशीर पेन्शन मिळू शकते.'
          },
          steps: {
            en: [
              'Visit your nearest CSC with your Aadhaar and Bank Passbook.',
              'Initial contribution is paid in cash (e.g. ₹100 for age 29); subsequent monthly debits are auto-deducted.',
              'Receive your laminated PM-SYM Pension Card instantly on the spot.'
            ],
            hi: [
              'अपने आधार और बैंक पासबुक के साथ नजदीकी सीएससी केंद्र पर जाएं।',
              'पहला मासिक अंशदान नकद जमा करें (उदा. 29 वर्ष की उम्र पर मात्र ₹100); आगे की राशि बैंक से कटेगी।',
              'मौके पर ही अपना लेमिनेटेड पेंशन कार्ड प्राप्त करें।'
            ],
            mr: [
              'आपले आधार कार्ड आणि बँक पासबुक घेऊन जवळच्या महा-ई-सेवा किंवा CSC केंद्रात जा.',
              'पहिला हप्ता रोख जमा करा (उदा. वयाच्या २९ व्या वर्षी फक्त ₹100); पुढील हप्ते बँकेतून आपोआप कापले जातील.',
              'त्याच वेळी लॅमिनेटेड PM-SYM पेन्शन कार्ड मिळवा.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'PM-SYM requires applicants to enroll between ages 18-40 and hold an active bank account with auto-debit facility.',
            hi: 'इस पेंशन योजना में जुड़ने के लिए आयु 18 से 40 वर्ष और सक्रिय बैंक बचत खाता होना आवश्यक है।',
            mr: 'या पेन्शन योजनेसाठी वय 18 ते 40 वर्षांच्या दरम्यान असणे आणि सक्रिय बँक खाते असणे आवश्यक आहे.'
          },
          steps: {
            en: [
              'Check if your age is within 18-40 years.',
              'If over 40, explore Atal Pension Yojana (APY) through your bank branch.',
              'Ensure your bank savings account has active Jan Dhan auto-debit consent.'
            ],
            hi: [
              'जांचें कि आपकी आयु 18 से 40 वर्ष के बीच है या नहीं।',
              'यदि उम्र 40 से अधिक है, तो अपनी बैंक शाखा में जाकर अटल पेंशन योजना (APY) का पता लगाएं।',
              'बैंक खाते में ऑटो-डेबिट सुविधा चालू करवाएं।'
            ],
            mr: [
              'आपले वय 18 ते 40 वर्षे आहे का ते तपासा.',
              'वय 40 पेक्षा जास्त असल्यास बँकेत जाऊन अटल पेन्शन योजना (APY) ची माहिती घ्या.',
              'बँक खात्यामध्ये ऑटो-डेबिट संमती दिलेली आहे याची खात्री करा.'
            ]
          }
        };
      }
    }
  },
  {
    id: 'landless-labourer-mh',
    name: {
      en: 'State Landless Labourer Land-Purchase Scheme (Karmaveer Dadasaheb Gaikwad)',
      hi: 'भूमिहीन कृषि मजदूर भूमि खरीद योजना (कर्मवीर दादासाहेब गायकवाड योजना)',
      mr: 'कर्मवीर दादासाहेब गायकवाड सबलीकरण व स्वाभिमान योजना (जमीन खरेदी अनुदान)'
    },
    level: 'state',
    benefit: {
      en: '100% state government grant to purchase up to 4 acres dry or 2 acres irrigated land for landless families',
      hi: 'भूमिहीन परिवारों को खेती के लिए 4 एकड़ जिरायत या 2 एकड़ बागायत जमीन खरीदने हेतु 100% सरकारी अनुदान',
      mr: 'भूमिहीन शेतमजुरांना हक्काची शेतजमीन मिळण्यासाठी 4 एकर कोरडवाहू किंवा 2 एकर बागायत जमिनीच्या खरेदीसाठी 100% शासकीय अनुदान'
    },
    evaluate: (answers) => {
      const isMH = (answers.state || 'Maharashtra').toLowerCase().includes('maharashtra');
      const isReserved = answers.category === 'SC' || answers.category === 'ST';
      const isLowIncome = answers.incomeRange === 'income1' || answers.incomeRange === '<1L';

      if (isMH && (isReserved || isLowIncome)) {
        return {
          status: 'qualify',
          why: {
            en: 'Maharashtra government provides 100% financial assistance (50% subsidy + 50% interest-free loan) to landless SC/ST/BPL agricultural laborers to become proud landowners.',
            hi: 'महाराष्ट्र शासन भूमिहीन अनुसूचित जाति/जनजाति और गरीब खेत मजदूरों को जमीन का मालिक बनाने के लिए 100% वित्तीय सहायता प्रदान करता है।',
            mr: 'महाराष्ट्र शासन अनुसूचित जाती/जमाती व दारिद्र्यरेषेखालील भूमिहीन शेतमजुरांना स्वाभिमानी जमीनमालक बनवण्यासाठी 100% शासकीय अर्थसहाय्य देते.'
          },
          steps: {
            en: [
              'Submit an application to the Assistant Commissioner of Social Welfare / District Social Welfare Officer.',
              'Attach BPL certificate / Income certificate, Caste certificate, and certificate from Talathi that you own zero land.',
              'The District Committee identifies agricultural land from willing sellers and registers it in the beneficiary name.'
            ],
            hi: [
              'सहायक आयुक्त, समाज कल्याण विभाग / जिला समाज कल्याण अधिकारी को आवेदन प्रस्तुत करें।',
              'बीपीएल राशन कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र और तलाठी का भूमिहीन होने का प्रमाण पत्र संलग्न करें।',
              'जिला समिति जमीन विक्रेता से जमीन खरीदकर सीधे आपके नाम पर पंजीकृत करवाती है।'
            ],
            mr: [
              'जिल्हा समाज कल्याण अधिकारी / सहायक आयुक्त समाज कल्याण यांच्याकडे विहित नमुन्यात अर्ज करा.',
              'बीपीएल रेशनकार्ड, उत्पन्न दाखला, जात प्रमाणपत्र आणि तलाठ्यांचा जमीन नसल्याचा दाखला जोडा.',
              'जिल्हा समिती जमीन खरेदी करून थेट तुमच्या नावावर खरेदीखत करून देते.'
            ]
          }
        };
      } else {
        return {
          status: 'missing',
          why: {
            en: 'This special Maharashtra state scheme is prioritized for Below-Poverty-Line (BPL) landless agricultural laborers from SC/ST communities.',
            hi: 'यह विशेष महाराष्ट्र राज्य योजना दारिद्र्य रेखा से नीचे (बीपीएल) रहने वाले एससी/एसटी वर्ग के भूमिहीन कृषि श्रमिकों के लिए लक्षित है।',
            mr: 'ही योजना विशेषतः दारिद्र्यरेषेखालील अनुसूचित जाती/जमाती प्रवर्गातील भूमिहीन शेतमजुरांसाठी प्राधान्याने राबवली जाते.'
          },
          steps: {
            en: [
              'Obtain a certified Landless Certificate from your local Tehsildar / Talathi.',
              'Check district-level quota notifications with the Social Welfare Office.',
              'Explore alternative state dairy or goat farming livelihood subsidies.'
            ],
            hi: [
              'अपने तहसीलदार या तलाठी से प्रमाणित भूमिहीन प्रमाण पत्र प्राप्त करें।',
              'जिला समाज कल्याण कार्यालय में नई अधिसूचनाओं की जानकारी लें।',
              'पशुपालन या बकरी पालन हेतु मिलने वाली अन्य राज्य योजनाओं की जानकारी लें।'
            ],
            mr: [
              'तहसीलदार किंवा तलाठ्यांकडून अधिकृत भूमिहीन दाखला मिळवा.',
              'जिल्हा समाज कल्याण कार्यालयाकडून चालू वर्षाच्या उद्दिष्टांची माहिती घ्या.',
              'गायी-म्हशी किंवा शेळीपालनासाठी उपलब्ध असलेल्या इतर अनुदानाचा शोध घ्या.'
            ]
          }
        };
      }
    }
  }
];
