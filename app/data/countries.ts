/** Country entry with ISO code for flag emoji generation */
export interface Country {
  code: string
  name: string
  nameSk: string
}

/** Convert ISO 3166-1 alpha-2 code to flag emoji */
export function countryFlag(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

/** Countries list — sorted by Slovak name, neighbours + common first */
export const COUNTRIES: Country[] = [
  { code: 'SK', name: 'Slovakia', nameSk: 'Slovensko' },
  { code: 'CZ', name: 'Czechia', nameSk: 'Česko' },
  { code: 'PL', name: 'Poland', nameSk: 'Poľsko' },
  { code: 'HU', name: 'Hungary', nameSk: 'Maďarsko' },
  { code: 'AT', name: 'Austria', nameSk: 'Rakúsko' },
  { code: 'UA', name: 'Ukraine', nameSk: 'Ukrajina' },
  { code: 'DE', name: 'Germany', nameSk: 'Nemecko' },
  { code: 'GB', name: 'United Kingdom', nameSk: 'Veľká Británia' },
  { code: 'US', name: 'United States', nameSk: 'Spojené štáty' },
  { code: 'FR', name: 'France', nameSk: 'Francúzsko' },
  { code: 'IT', name: 'Italy', nameSk: 'Taliansko' },
  { code: 'ES', name: 'Spain', nameSk: 'Španielsko' },
  { code: 'NL', name: 'Netherlands', nameSk: 'Holandsko' },
  { code: 'BE', name: 'Belgium', nameSk: 'Belgicko' },
  { code: 'CH', name: 'Switzerland', nameSk: 'Švajčiarsko' },
  { code: 'RO', name: 'Romania', nameSk: 'Rumunsko' },
  { code: 'HR', name: 'Croatia', nameSk: 'Chorvátsko' },
  { code: 'SI', name: 'Slovenia', nameSk: 'Slovinsko' },
  { code: 'RS', name: 'Serbia', nameSk: 'Srbsko' },
  { code: 'BG', name: 'Bulgaria', nameSk: 'Bulharsko' },
  { code: 'DK', name: 'Denmark', nameSk: 'Dánsko' },
  { code: 'SE', name: 'Sweden', nameSk: 'Švédsko' },
  { code: 'NO', name: 'Norway', nameSk: 'Nórsko' },
  { code: 'FI', name: 'Finland', nameSk: 'Fínsko' },
  { code: 'IE', name: 'Ireland', nameSk: 'Írsko' },
  { code: 'PT', name: 'Portugal', nameSk: 'Portugalsko' },
  { code: 'GR', name: 'Greece', nameSk: 'Grécko' },
  { code: 'TR', name: 'Turkey', nameSk: 'Turecko' },
  { code: 'RU', name: 'Russia', nameSk: 'Rusko' },
  { code: 'CA', name: 'Canada', nameSk: 'Kanada' },
  { code: 'AU', name: 'Australia', nameSk: 'Austrália' },
  { code: 'BR', name: 'Brazil', nameSk: 'Brazília' },
  { code: 'JP', name: 'Japan', nameSk: 'Japonsko' },
  { code: 'KR', name: 'South Korea', nameSk: 'Južná Kórea' },
  { code: 'CN', name: 'China', nameSk: 'Čína' },
  { code: 'IN', name: 'India', nameSk: 'India' },
  { code: 'IL', name: 'Israel', nameSk: 'Izrael' },
  { code: 'MX', name: 'Mexico', nameSk: 'Mexiko' },
  { code: 'AR', name: 'Argentina', nameSk: 'Argentína' },
  { code: 'ZA', name: 'South Africa', nameSk: 'Južná Afrika' },
  { code: 'EE', name: 'Estonia', nameSk: 'Estónsko' },
  { code: 'LV', name: 'Latvia', nameSk: 'Lotyšsko' },
  { code: 'LT', name: 'Lithuania', nameSk: 'Litva' },
  { code: 'LU', name: 'Luxembourg', nameSk: 'Luxembursko' },
  { code: 'MT', name: 'Malta', nameSk: 'Malta' },
  { code: 'CY', name: 'Cyprus', nameSk: 'Cyprus' },
  { code: 'IS', name: 'Iceland', nameSk: 'Island' },
  { code: 'AL', name: 'Albania', nameSk: 'Albánsko' },
  { code: 'BA', name: 'Bosnia and Herzegovina', nameSk: 'Bosna a Hercegovina' },
  { code: 'ME', name: 'Montenegro', nameSk: 'Čierna Hora' },
  { code: 'MK', name: 'North Macedonia', nameSk: 'Severné Macedónsko' },
  { code: 'MD', name: 'Moldova', nameSk: 'Moldavsko' },
  { code: 'GE', name: 'Georgia', nameSk: 'Gruzínsko' },
  { code: 'NZ', name: 'New Zealand', nameSk: 'Nový Zéland' },
  { code: 'SG', name: 'Singapore', nameSk: 'Singapur' },
  { code: 'TH', name: 'Thailand', nameSk: 'Thajsko' },
  { code: 'AE', name: 'United Arab Emirates', nameSk: 'Spojené arabské emiráty' },
  { code: 'EG', name: 'Egypt', nameSk: 'Egypt' },
  { code: 'KE', name: 'Kenya', nameSk: 'Keňa' },
  { code: 'NG', name: 'Nigeria', nameSk: 'Nigéria' },
  { code: 'CO', name: 'Colombia', nameSk: 'Kolumbia' },
  { code: 'CL', name: 'Chile', nameSk: 'Čile' },
  { code: 'PE', name: 'Peru', nameSk: 'Peru' },
  { code: 'PH', name: 'Philippines', nameSk: 'Filipíny' },
  { code: 'ID', name: 'Indonesia', nameSk: 'Indonézia' },
  { code: 'MY', name: 'Malaysia', nameSk: 'Malajzia' },
  { code: 'VN', name: 'Vietnam', nameSk: 'Vietnam' },
  { code: 'TW', name: 'Taiwan', nameSk: 'Taiwan' },
  { code: 'PK', name: 'Pakistan', nameSk: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh', nameSk: 'Bangladéš' },
  { code: 'SA', name: 'Saudi Arabia', nameSk: 'Saudská Arábia' },
]
