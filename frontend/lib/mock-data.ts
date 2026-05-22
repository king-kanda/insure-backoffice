export type Customer = {
  id: string;
  name: string;
  idNumber: string;
  kraPin: string;
  phone: string;
  email: string;
  address: string;
  policiesCount: number;
  lastActivity: string;
  status: "active" | "inactive";
};

export type Policy = {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  coverType: "motor" | "medical" | "fire";
  startDate: string;
  expiryDate: string;
  premium: number;
  status: "active" | "expired" | "pending";
};

export type Claim = {
  id: string;
  claimId: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  dateSubmitted: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "paid";
  amount: number;
  description: string;
};

export const mockCustomers: Customer[] = [
  { id: "c1",  name: "Amina Wanjiku Mwangi",   idNumber: "28341027", kraPin: "A123456789B", phone: "0712 345 678", email: "amina.mwangi@gmail.com",    address: "Westlands, Nairobi",       policiesCount: 2, lastActivity: "2024-10-28", status: "active"   },
  { id: "c2",  name: "Brian Otieno Odhiambo",   idNumber: "31456789", kraPin: "B234567890C", phone: "0723 456 789", email: "b.otieno@outlook.com",       address: "Kilimani, Nairobi",        policiesCount: 1, lastActivity: "2024-10-15", status: "active"   },
  { id: "c3",  name: "Catherine Njeri Kamau",   idNumber: "22987654", kraPin: "C345678901D", phone: "0734 567 890", email: "cnjeri@gmail.com",           address: "Karen, Nairobi",           policiesCount: 3, lastActivity: "2024-11-01", status: "active"   },
  { id: "c4",  name: "David Kipchoge Rotich",   idNumber: "29876543", kraPin: "D456789012E", phone: "0745 678 901", email: "d.rotich@safaricom.co.ke",   address: "Eldoret, Uasin Gishu",     policiesCount: 2, lastActivity: "2024-09-20", status: "active"   },
  { id: "c5",  name: "Eunice Akinyi Omondi",    idNumber: "33214567", kraPin: "E567890123F", phone: "0756 789 012", email: "eunice.omondi@yahoo.com",    address: "Kisumu, Kisumu County",    policiesCount: 1, lastActivity: "2024-10-05", status: "inactive" },
  { id: "c6",  name: "Francis Mwenda Mutua",    idNumber: "26543210", kraPin: "F678901234G", phone: "0767 890 123", email: "fmutua@gmail.com",           address: "Machakos, Machakos County",policiesCount: 2, lastActivity: "2024-10-30", status: "active"   },
  { id: "c7",  name: "Grace Chebet Kipkoech",   idNumber: "30987654", kraPin: "G789012345H", phone: "0778 901 234", email: "grace.chebet@gmail.com",     address: "Nakuru, Nakuru County",    policiesCount: 1, lastActivity: "2024-08-14", status: "inactive" },
  { id: "c8",  name: "Hassan Abdi Mohamed",     idNumber: "27654321", kraPin: "H890123456I", phone: "0789 012 345", email: "hassan.abdi@gmail.com",      address: "Mombasa, Mombasa County",  policiesCount: 3, lastActivity: "2024-11-01", status: "active"   },
  { id: "c9",  name: "Irene Wambui Gichuru",    idNumber: "32109876", kraPin: "I901234567J", phone: "0790 123 456", email: "irene.wambui@outlook.com",   address: "Thika, Kiambu County",     policiesCount: 2, lastActivity: "2024-10-22", status: "active"   },
  { id: "c10", name: "James Ndirangu Kamau",    idNumber: "25432198", kraPin: "J012345678K", phone: "0701 234 567", email: "j.ndirangu@gmail.com",       address: "Nyeri, Nyeri County",      policiesCount: 1, lastActivity: "2024-09-30", status: "active"   },
  { id: "c11", name: "Kezia Moraa Nyamweya",    idNumber: "34567890", kraPin: "K123456789L", phone: "0712 345 901", email: "kezia.moraa@gmail.com",      address: "Kisii, Kisii County",      policiesCount: 2, lastActivity: "2024-10-18", status: "active"   },
  { id: "c12", name: "Lilian Auma Were",        idNumber: "28901234", kraPin: "L234567890M", phone: "0723 456 012", email: "l.auma@yahoo.com",           address: "Busia, Busia County",      policiesCount: 1, lastActivity: "2024-07-25", status: "inactive" },
  { id: "c13", name: "Martin Kariuki Mwangi",   idNumber: "31234567", kraPin: "M345678901N", phone: "0734 567 123", email: "martin.kariuki@gmail.com",   address: "Ruiru, Kiambu County",     policiesCount: 3, lastActivity: "2024-11-01", status: "active"   },
  { id: "c14", name: "Nancy Wanjiru Njoroge",   idNumber: "27890123", kraPin: "N456789012O", phone: "0745 678 234", email: "nancy.njoroge@gmail.com",    address: "Kikuyu, Kiambu County",    policiesCount: 2, lastActivity: "2024-10-10", status: "active"   },
  { id: "c15", name: "Oscar Ochieng Otieno",    idNumber: "30123456", kraPin: "O567890123P", phone: "0756 789 345", email: "o.ochieng@gmail.com",        address: "Homa Bay, Homa Bay County",policiesCount: 1, lastActivity: "2024-09-15", status: "active"   },
  { id: "c16", name: "Phyllis Cherotich Sang",  idNumber: "26789012", kraPin: "P678901234Q", phone: "0767 890 456", email: "phyllis.sang@outlook.com",   address: "Kericho, Kericho County",  policiesCount: 2, lastActivity: "2024-10-27", status: "active"   },
  { id: "c17", name: "Quincy Juma Barasa",      idNumber: "33456789", kraPin: "Q789012345R", phone: "0778 901 567", email: "qjuma@gmail.com",            address: "Kakamega, Kakamega County",policiesCount: 1, lastActivity: "2024-08-30", status: "inactive" },
  { id: "c18", name: "Ruth Nyambura Githinji",  idNumber: "29012345", kraPin: "R890123456S", phone: "0789 012 678", email: "ruth.nyambura@gmail.com",    address: "Limuru, Kiambu County",    policiesCount: 2, lastActivity: "2024-10-31", status: "active"   },
  { id: "c19", name: "Samuel Waweru Mungai",    idNumber: "32345678", kraPin: "S901234567T", phone: "0790 123 789", email: "s.waweru@gmail.com",         address: "Githunguri, Kiambu County",policiesCount: 3, lastActivity: "2024-11-01", status: "active"   },
  { id: "c20", name: "Teresa Adhiambo Oloo",    idNumber: "25678901", kraPin: "T012345678U", phone: "0701 234 890", email: "teresa.oloo@gmail.com",      address: "Siaya, Siaya County",      policiesCount: 1, lastActivity: "2024-09-05", status: "active"   },
  { id: "c21", name: "Usman Farah Abdi",        idNumber: "34012345", kraPin: "U123456789V", phone: "0712 345 901", email: "usman.farah@gmail.com",      address: "Garissa, Garissa County",  policiesCount: 2, lastActivity: "2024-10-20", status: "active"   },
  { id: "c22", name: "Veronica Wangari Mugo",   idNumber: "28456789", kraPin: "V234567890W", phone: "0723 456 012", email: "v.wangari@outlook.com",      address: "Murang'a, Murang'a County",policiesCount: 1, lastActivity: "2024-10-08", status: "active"   },
  { id: "c23", name: "Walter Maina Kimani",     idNumber: "31789012", kraPin: "W345678901X", phone: "0734 567 123", email: "walter.maina@gmail.com",     address: "Juja, Kiambu County",      policiesCount: 2, lastActivity: "2024-11-01", status: "active"   },
  { id: "c24", name: "Xenia Awino Anyango",     idNumber: "27234567", kraPin: "X456789012Y", phone: "0745 678 234", email: "xenia.anyango@gmail.com",    address: "Migori, Migori County",    policiesCount: 1, lastActivity: "2024-07-15", status: "inactive" },
  { id: "c25", name: "Zachary Kipngetich Bett", idNumber: "30567890", kraPin: "Z567890123A", phone: "0756 789 345", email: "z.bett@gmail.com",           address: "Bomet, Bomet County",      policiesCount: 2, lastActivity: "2024-10-25", status: "active"   },
];

export const mockPolicies: Policy[] = [
  { id: "p1",  policyNumber: "POL-2024-00101", customerId: "c1",  customerName: "Amina Wanjiku Mwangi",   coverType: "motor",   startDate: "2024-01-15", expiryDate: "2025-01-15", premium: 28500,  status: "active"  },
  { id: "p2",  policyNumber: "POL-2024-00102", customerId: "c1",  customerName: "Amina Wanjiku Mwangi",   coverType: "medical", startDate: "2024-03-01", expiryDate: "2025-03-01", premium: 45000,  status: "active"  },
  { id: "p3",  policyNumber: "POL-2024-00103", customerId: "c2",  customerName: "Brian Otieno Odhiambo",  coverType: "motor",   startDate: "2024-02-10", expiryDate: "2024-11-15", premium: 32000,  status: "expired" },
  { id: "p4",  policyNumber: "POL-2024-00104", customerId: "c3",  customerName: "Catherine Njeri Kamau",  coverType: "motor",   startDate: "2024-04-01", expiryDate: "2025-04-01", premium: 25000,  status: "active"  },
  { id: "p5",  policyNumber: "POL-2024-00105", customerId: "c3",  customerName: "Catherine Njeri Kamau",  coverType: "medical", startDate: "2024-06-15", expiryDate: "2025-06-15", premium: 60000,  status: "active"  },
  { id: "p6",  policyNumber: "POL-2024-00106", customerId: "c3",  customerName: "Catherine Njeri Kamau",  coverType: "fire",    startDate: "2024-01-01", expiryDate: "2024-12-31", premium: 18000,  status: "active"  },
  { id: "p7",  policyNumber: "POL-2024-00107", customerId: "c4",  customerName: "David Kipchoge Rotich",  coverType: "motor",   startDate: "2024-05-20", expiryDate: "2025-05-20", premium: 35000,  status: "active"  },
  { id: "p8",  policyNumber: "POL-2024-00108", customerId: "c4",  customerName: "David Kipchoge Rotich",  coverType: "fire",    startDate: "2023-11-01", expiryDate: "2024-11-01", premium: 22000,  status: "expired" },
  { id: "p9",  policyNumber: "POL-2024-00109", customerId: "c5",  customerName: "Eunice Akinyi Omondi",   coverType: "medical", startDate: "2024-07-01", expiryDate: "2025-07-01", premium: 52000,  status: "pending" },
  { id: "p10", policyNumber: "POL-2024-00110", customerId: "c6",  customerName: "Francis Mwenda Mutua",   coverType: "motor",   startDate: "2024-03-15", expiryDate: "2025-03-15", premium: 29000,  status: "active"  },
  { id: "p11", policyNumber: "POL-2024-00111", customerId: "c6",  customerName: "Francis Mwenda Mutua",   coverType: "fire",    startDate: "2024-08-01", expiryDate: "2025-08-01", premium: 15000,  status: "active"  },
  { id: "p12", policyNumber: "POL-2024-00112", customerId: "c8",  customerName: "Hassan Abdi Mohamed",    coverType: "motor",   startDate: "2024-02-28", expiryDate: "2025-02-28", premium: 41000,  status: "active"  },
  { id: "p13", policyNumber: "POL-2024-00113", customerId: "c8",  customerName: "Hassan Abdi Mohamed",    coverType: "medical", startDate: "2024-09-01", expiryDate: "2025-09-01", premium: 75000,  status: "active"  },
  { id: "p14", policyNumber: "POL-2024-00114", customerId: "c9",  customerName: "Irene Wambui Gichuru",   coverType: "motor",   startDate: "2024-10-15", expiryDate: "2025-11-05", premium: 27000,  status: "active"  },
  { id: "p15", policyNumber: "POL-2024-00115", customerId: "c9",  customerName: "Irene Wambui Gichuru",   coverType: "fire",    startDate: "2024-04-01", expiryDate: "2025-04-01", premium: 19500,  status: "active"  },
  { id: "p16", policyNumber: "POL-2024-00116", customerId: "c13", customerName: "Martin Kariuki Mwangi",  coverType: "motor",   startDate: "2024-01-20", expiryDate: "2025-01-20", premium: 33000,  status: "active"  },
  { id: "p17", policyNumber: "POL-2024-00117", customerId: "c13", customerName: "Martin Kariuki Mwangi",  coverType: "medical", startDate: "2024-05-01", expiryDate: "2025-05-01", premium: 48000,  status: "active"  },
  { id: "p18", policyNumber: "POL-2024-00118", customerId: "c16", customerName: "Phyllis Cherotich Sang", coverType: "motor",   startDate: "2024-07-10", expiryDate: "2025-07-10", premium: 26500,  status: "active"  },
  { id: "p19", policyNumber: "POL-2024-00119", customerId: "c19", customerName: "Samuel Waweru Mungai",   coverType: "motor",   startDate: "2024-11-10", expiryDate: "2025-11-10", premium: 38000,  status: "active"  },
  { id: "p20", policyNumber: "POL-2024-00120", customerId: "c21", customerName: "Usman Farah Abdi",       coverType: "fire",    startDate: "2024-06-01", expiryDate: "2024-11-20", premium: 17000,  status: "active"  },
];

export const mockClaims: Claim[] = [
  { id: "cl1",  claimId: "CLM-2024-00001", customerId: "c1",  customerName: "Amina Wanjiku Mwangi",   policyNumber: "POL-2024-00101", dateSubmitted: "2024-10-01", status: "paid",         amount: 85000,  description: "Rear-end collision on Thika Road"         },
  { id: "cl2",  claimId: "CLM-2024-00002", customerId: "c2",  customerName: "Brian Otieno Odhiambo",  policyNumber: "POL-2024-00103", dateSubmitted: "2024-10-05", status: "approved",     amount: 120000, description: "Vehicle theft at Westgate Mall"           },
  { id: "cl3",  claimId: "CLM-2024-00003", customerId: "c3",  customerName: "Catherine Njeri Kamau",  policyNumber: "POL-2024-00105", dateSubmitted: "2024-10-08", status: "under_review", amount: 45000,  description: "Hospitalisation — appendectomy"           },
  { id: "cl4",  claimId: "CLM-2024-00004", customerId: "c4",  customerName: "David Kipchoge Rotich",  policyNumber: "POL-2024-00107", dateSubmitted: "2024-10-10", status: "pending",      amount: 200000, description: "Windscreen & panel damage — hailstorm"    },
  { id: "cl5",  claimId: "CLM-2024-00005", customerId: "c6",  customerName: "Francis Mwenda Mutua",   policyNumber: "POL-2024-00111", dateSubmitted: "2024-10-12", status: "rejected",     amount: 350000, description: "Warehouse fire — electrical fault"        },
  { id: "cl6",  claimId: "CLM-2024-00006", customerId: "c8",  customerName: "Hassan Abdi Mohamed",    policyNumber: "POL-2024-00112", dateSubmitted: "2024-10-15", status: "under_review", amount: 95000,  description: "Accident on Mombasa-Nairobi highway"     },
  { id: "cl7",  claimId: "CLM-2024-00007", customerId: "c9",  customerName: "Irene Wambui Gichuru",   policyNumber: "POL-2024-00114", dateSubmitted: "2024-10-18", status: "approved",     amount: 65000,  description: "Flood damage — parking basement"         },
  { id: "cl8",  claimId: "CLM-2024-00008", customerId: "c13", customerName: "Martin Kariuki Mwangi",  policyNumber: "POL-2024-00116", dateSubmitted: "2024-10-20", status: "pending",      amount: 180000, description: "Hit and run — Northern Bypass"           },
  { id: "cl9",  claimId: "CLM-2024-00009", customerId: "c14", customerName: "Nancy Wanjiru Njoroge",  policyNumber: "POL-2024-00101", dateSubmitted: "2024-10-22", status: "paid",         amount: 30000,  description: "Minor fender bender — Ngong Road"        },
  { id: "cl10", claimId: "CLM-2024-00010", customerId: "c16", customerName: "Phyllis Cherotich Sang", policyNumber: "POL-2024-00118", dateSubmitted: "2024-10-24", status: "under_review", amount: 75000,  description: "Engine damage — flooding Nakuru"         },
  { id: "cl11", claimId: "CLM-2024-00011", customerId: "c18", customerName: "Ruth Nyambura Githinji", policyNumber: "POL-2024-00102", dateSubmitted: "2024-10-25", status: "approved",     amount: 120000, description: "Surgery — knee replacement"               },
  { id: "cl12", claimId: "CLM-2024-00012", customerId: "c19", customerName: "Samuel Waweru Mungai",   policyNumber: "POL-2024-00119", dateSubmitted: "2024-10-27", status: "pending",      amount: 250000, description: "Carjacking — Kahawa Wendani"             },
  { id: "cl13", claimId: "CLM-2024-00013", customerId: "c21", customerName: "Usman Farah Abdi",       policyNumber: "POL-2024-00120", dateSubmitted: "2024-10-28", status: "under_review", amount: 400000, description: "Shop fire — Garissa Town Centre"         },
  { id: "cl14", claimId: "CLM-2024-00014", customerId: "c3",  customerName: "Catherine Njeri Kamau",  policyNumber: "POL-2024-00104", dateSubmitted: "2024-10-29", status: "pending",      amount: 55000,  description: "Side-swipe — Ngong Road roundabout"      },
  { id: "cl15", claimId: "CLM-2024-00015", customerId: "c8",  customerName: "Hassan Abdi Mohamed",    policyNumber: "POL-2024-00113", dateSubmitted: "2024-10-30", status: "approved",     amount: 88000,  description: "ICU admission — cardiac event"           },
  { id: "cl16", claimId: "CLM-2024-00016", customerId: "c13", customerName: "Martin Kariuki Mwangi",  policyNumber: "POL-2024-00117", dateSubmitted: "2024-10-31", status: "paid",         amount: 42000,  description: "Outpatient — diagnostic tests"           },
  { id: "cl17", claimId: "CLM-2024-00017", customerId: "c25", customerName: "Zachary Kipngetich Bett",policyNumber: "POL-2024-00110", dateSubmitted: "2024-11-01", status: "pending",      amount: 160000, description: "Total loss — drunk driver collision"     },
  { id: "cl18", claimId: "CLM-2024-00018", customerId: "c23", customerName: "Walter Maina Kimani",    policyNumber: "POL-2024-00112", dateSubmitted: "2024-11-01", status: "under_review", amount: 70000,  description: "Burst tyre — rollover Kiambu Road"       },
  { id: "cl19", claimId: "CLM-2024-00019", customerId: "c11", customerName: "Kezia Moraa Nyamweya",   policyNumber: "POL-2024-00105", dateSubmitted: "2024-11-01", status: "pending",      amount: 95000,  description: "Maternity — private hospital"            },
  { id: "cl20", claimId: "CLM-2024-00020", customerId: "c6",  customerName: "Francis Mwenda Mutua",   policyNumber: "POL-2024-00110", dateSubmitted: "2024-11-01", status: "rejected",     amount: 310000, description: "Alleged theft — insufficient evidence"   },
];
