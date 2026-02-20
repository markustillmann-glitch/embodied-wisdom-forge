export type { TriggerCard } from './types';
export { triggerCategories } from './types';

import { beziehungCards } from './beziehung';
import { leistungCards } from './leistung';
import { familieCards } from './familie';
import { selbstwertCards } from './selbstwert';
import { sicherheitCards } from './sicherheit';
import { intimitaetCards } from './intimitaet';
import { statusCards } from './status';
import { sinnCards } from './sinn';
import { koerperCards } from './koerper';
import { zukunftCards } from './zukunft';

export const triggerCards = [
  ...beziehungCards,
  ...leistungCards,
  ...familieCards,
  ...selbstwertCards,
  ...sicherheitCards,
  ...intimitaetCards,
  ...statusCards,
  ...sinnCards,
  ...koerperCards,
  ...zukunftCards,
];
