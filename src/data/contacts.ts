export interface Contact {
  id: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  region: string;
  website?: string;
  hours?: string;
}

export const contacts: Contact[] = [
  // Федеральные организации
  {
    id: '1',
    name: 'Федеральная инспекция труда',
    type: 'Трудовые права',
    phone: '+7 (495) 987-75-55',
    address: 'Москва, ул. Охотный ряд, 2',
    region: 'Федеральный',
    website: 'https://www.rostrud.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '2',
    name: 'Роспотребнадзор',
    type: 'Защита прав потребителей',
    phone: '+7 (495) 953-73-96',
    address: 'Москва, Графский пер., 4',
    region: 'Федеральный',
    website: 'https://www.rospotrebnadzor.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '3',
    name: 'Федеральная служба судебных приставов',
    type: 'Исполнение решений',
    phone: '+7 (495) 539-21-00',
    address: 'Москва, ул. Большая Полянка, 43',
    region: 'Федеральный',
    website: 'https://fssprus.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '4',
    name: 'Прокуратура РФ',
    type: 'Защита прав граждан',
    phone: '+7 (495) 692-20-20',
    address: 'Москва, ул. Большая Полянка, 43',
    region: 'Федеральный',
    website: 'https://www.genproc.gov.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '5',
    name: 'МФЦ (Многофункциональный центр)',
    type: 'Государственные услуги',
    phone: '+7 (495) 777-77-77',
    address: 'Москва, различные филиалы',
    region: 'Москва',
    website: 'https://www.mfc.ru',
    hours: 'Пн-Сб: 8:00-20:00',
  },
  {
    id: '6',
    name: 'Центр бесплатной юридической помощи',
    type: 'Юридическая помощь',
    phone: '+7 (495) 123-45-67',
    address: 'Москва, ул. Петровка, 38',
    region: 'Москва',
    website: 'https://www.minjust.ru',
    hours: 'Пн-Пт: 9:00-18:00',
  },
  {
    id: '7',
    name: 'ГИБДД МВД России',
    type: 'Административные нарушения',
    phone: '+7 (495) 692-70-00',
    address: 'Москва, ул. Садовая-Кудринская, 1',
    region: 'Федеральный',
    website: 'https://www.gibdd.ru',
    hours: 'Пн-Пт: 9:00-18:00',
  },
  {
    id: '8',
    name: 'Пенсионный фонд России',
    type: 'Государственная помощь',
    phone: '+7 (495) 987-88-88',
    address: 'Москва, ул. Зубовский бульвар, 4',
    region: 'Федеральный',
    website: 'https://www.pfrf.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '9',
    name: 'Фонд социального страхования',
    type: 'Государственная помощь',
    phone: '+7 (495) 916-00-00',
    address: 'Москва, ул. Славянская, 1',
    region: 'Федеральный',
    website: 'https://www.fss.ru',
    hours: 'Пн-Чт: 9:00-18:00, Пт: 9:00-16:45',
  },
  {
    id: '10',
    name: 'Портал Госуслуги',
    type: 'Государственные услуги',
    phone: '+7 (800) 333-44-99',
    address: 'Онлайн-сервис',
    region: 'Федеральный',
    website: 'https://www.gosuslugi.ru',
    hours: '24/7',
  },
];

export const getContactsByType = (type: string): Contact[] => {
  return contacts.filter((contact) => contact.type === type);
};

export const getContactsByRegion = (region: string): Contact[] => {
  return contacts.filter((contact) => contact.region === region || contact.region === 'Федеральный');
};

export const getAllTypes = (): string[] => {
  return Array.from(new Set(contacts.map((c) => c.type)));
};

export const getAllRegions = (): string[] => {
  return Array.from(new Set(contacts.map((c) => c.region)));
};
