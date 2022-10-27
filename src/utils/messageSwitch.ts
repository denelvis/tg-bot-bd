// eslint-disable-next-line max-len
export const initString = `*Январь*\n*Февраль*\n*Март*\n*Апрель*\n*Май*\n*Июнь*\n*Июль*\n*Август*\n*Сентябрь*\n*Октябрь*\n*Ноябрь*\n*Декабрь*`;

export const messageSwitch = (acc: string, month: string, day: string, name: string) => {
  switch (month) {
    case '01':
      return acc.replace(/([*]Февраль[*])/gim, `${day}: ${name}\n*Февраль*`);
    case '02':
      return acc.replace(/([*]Март[*])/gim, `${day}: ${name}\n*Март*`);
    case '03':
      return acc.replace(/([*]Апрель[*])/gim, `${day}: ${name}\n*Апрель*`);
    case '04':
      return acc.replace(/([*]Май[*])/gim, `${day}: ${name}\n*Май*`);
    case '05':
      return acc.replace(/([*]Июнь[*])/gim, `${day}: ${name}\n*Июнь*`);
    case '06':
      return acc.replace(/([*]Июль[*])/gim, `${day}: ${name}\n*Июль*`);
    case '07':
      return acc.replace(/([*]Август[*])/gim, `${day}: ${name}\n*Август*`);
    case '08':
      return acc.replace(/([*]Сентябрь[*])/gim, `${day}: ${name}\n*Сентябрь*`);
    case '09':
      return acc.replace(/([*]Октябрь[*])/gim, `${day}: ${name}\n*Октябрь*`);
    case '10':
      return acc.replace(/([*]Ноябрь[*])/gim, `${day}: ${name}\n*Ноябрь*`);
    case '11':
      return acc.replace(/([*]Декабрь[*])/gim, `${day}: ${name}\n*Декабрь*`);
    case '12':
      return acc.replace(/(Декабрь.*)/gims, `$1 \n${day}: ${name}`);
    default:
      break;
  }

  return acc.trim();
};
