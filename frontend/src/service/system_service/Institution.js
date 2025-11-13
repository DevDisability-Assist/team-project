export const CustomerService = {
  axios.get('http://localhost:3000/api/surveys')
  getData() {
    return [
      {
        id: 1,
        name: 'SURVEY-001', // 👈 조사지ID
        country: {
          name: '강남구 행복 센터', // 👈 조사지명
          code: 'kr',
        },
        company: 'Benton, John B Jr',
        date: '2025-11-12', // 👈 최종 수정일
        status: 'qualified',
        verified: true,
        activity: 17,
        representative: {
          name: '장애인지원센터1', // 👈 담당기관
        },
        balance: 10000, // 👈 상세보기 (데이터)
      },
      {
        id: 2,
        name: 'SURVEY-002',
        country: {
          name: '서초구 희망 센터',
          code: 'kr',
        },
        company: 'Chanay, Jeffrey A Esq',
        date: '2025-11-11',
        status: 'negotiation',
        verified: true,
        activity: 0,
        representative: {
          name: '장애인지원센터2',
        },
        balance: 20000,
      },
      {
        id: 3,
        name: 'SURVEY-003',
        country: {
          name: '송파구 나눔 센터',
          code: 'kr',
        },
        company: 'Chemel, James L Cpa',
        date: '2025-11-10',
        status: 'qualified',
        verified: false,
        activity: 63,
        representative: {
          name: '장애인지원센터3',
        },
        balance: 30000,
      },
      {
        id: 4,
        name: 'SURVEY-004',
        country: {
          name: '강동구 A 센터',
          code: 'kr',
        },
        company: 'Feltz Printing Service',
        date: '2025-11-09',
        status: 'new',
        verified: false,
        activity: 37,
        representative: {
          name: '장애인지원센터4',
        },
        balance: 40000,
      },
      {
        id: 5,
        name: 'SURVEY-005',
        country: {
          name: '광진구 B 센터',
          code: 'kr',
        },
        company: 'Printing Dimensions',
        date: '2025-11-08',
        status: 'negotiation',
        verified: true,
        activity: 33,
        representative: {
          name: '장애인지원센터5',
        },
        balance: 50000,
      },
      {
        id: 6,
        name: 'SURVEY-006',
        country: {
          name: '중랑구 C 센터',
          code: 'kr',
        },
        company: 'Chapman, Ross E Esq',
        date: '2025-11-07',
        status: 'qualified',
        verified: false,
        activity: 68,
        representative: {
          name: '장애인지원센터6',
        },
        balance: 60000,
      },
      {
        id: 7,
        name: 'SURVEY-007',
        country: {
          name: '노원구 D 센터',
          code: 'kr',
        },
        company: 'Morlong Associates',
        date: '2025-11-06',
        status: 'renewal',
        verified: true,
        activity: 54,
        representative: {
          name: '장애인지원센터7',
        },
        balance: 70000,
      },
      {
        id: 8,
        name: 'SURVEY-008',
        country: {
          name: '도봉구 E 센터',
          code: 'kr',
        },
        company: 'Commercial Press',
        date: '2025-11-05',
        status: 'renewal',
        verified: true,
        activity: 69,
        representative: {
          name: '장애인지원센터8',
        },
        balance: 80000,
      },
      {
        id: 9,
        name: 'SURVEY-009',
        country: {
          name: '강북구 F 센터',
          code: 'kr',
        },
        company: 'Truhlar And Truhlar Attys',
        date: '2025-11-04',
        status: 'unqualified',
        verified: true,
        activity: 76,
        representative: {
          name: '장애인지원센터9',
        },
        balance: 90000,
      },
    ];
  },

  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 10));
  },

  getCustomersMedium() {
    return Promise.resolve(this.getData().slice(0, 50));
  },

  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 200));
  },

  getCustomersXLarge() {
    return Promise.resolve(this.getData());
  },

  getCustomers(params) {
    const queryParams = params
      ? Object.keys(params)
          .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
          .join('&')
      : '';

    return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) =>
      res.json()
    );
  },
};
