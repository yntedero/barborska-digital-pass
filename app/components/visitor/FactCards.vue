<template>
  <div>
    <h3
      class="font-heading text-lg font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) mb-3"
    >
      {{ t('stop.facts') }}
    </h3>

    <!-- Scroll container with fade indicators -->
    <div class="relative">
      <!-- Right fade indicator -->
      <div
        class="absolute top-0 right-0 bottom-2 w-8 bg-gradient-to-l from-(--color-sand-50) dark:from-(--color-sand-950) to-transparent z-10 pointer-events-none rounded-r-xl"
        aria-hidden="true"
      />

      <div class="flex gap-3 overflow-x-auto scroll-hide pb-2 -mx-4 px-4">
        <div
          v-for="(fact, i) in facts"
          :key="i"
          class="flex-shrink-0 w-64 bg-white dark:bg-(--color-sand-800) rounded-xl p-4 border border-(--color-sand-200) dark:border-(--color-sand-700) shadow-sm hover:shadow-md hover:border-(--color-gold-200) dark:hover:border-(--color-gold-800) transition-all duration-200"
        >
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-gold-900) flex items-center justify-center shadow-sm"
            >
              <UIcon
                :name="fact.icon"
                class="size-4 text-(--color-gold-500)"
              />
            </div>
            <h4 class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ fact.title }}
            </h4>
          </div>
          <p class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed">
            {{ fact.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stopId: number
}>()

const { t } = useI18n()
const { getStop } = useTrailData()

const stop = computed(() => getStop(props.stopId))

interface Fact {
  icon: string
  title: string
  description: string
}

const factsDb: Record<number, Fact[]> = {
  1: [
    {
      icon: 'i-lucide-landmark',
      title: 'Barbakan',
      description:
        'Hradný komplex s Thurzo-Fugger expozíciou o spracovaní medi v stredovekej Európe.',
    },
    {
      icon: 'i-lucide-pickaxe',
      title: 'Medená cesta',
      description:
        'Banská Bystrica bola centrom najväčšej spoločnosti na spracovanie medi v 15. storočí.',
    },
    {
      icon: 'i-lucide-church',
      title: 'Kostol Nanebovzatia',
      description: 'Štartovací bod púte stojí pri gotickom kostole z 13. storočia.',
    },
  ],
  2: [
    {
      icon: 'i-lucide-church',
      title: 'Kostol sv. Jakuba',
      description: 'Gotický kostol v mestskej časti Jakub, patrón pútnikov.',
    },
    {
      icon: 'i-lucide-mountain',
      title: 'Najdlhšia krížová cesta',
      description: 'Odtiaľto začína najdlhšia krížová cesta v bývalom Hornom Uhorsku.',
    },
    {
      icon: 'i-lucide-footprints',
      title: 'Stúpanie',
      description: 'Náročný výstup cez les smerom na Španiu Dolinu s prevýšením 400 m.',
    },
  ],
  3: [
    {
      icon: 'i-lucide-gem',
      title: 'Medené bane',
      description: 'Ťažba medi tu fungovala od 10. storočia — jedny z najstarších v Európe.',
    },
    {
      icon: 'i-lucide-home',
      title: 'Pamiatková rezervácia',
      description: 'Zachovaná ľudová architektúra baníckych domov z 16.–19. storočia.',
    },
    {
      icon: 'i-lucide-users',
      title: 'Banícke bratstvo',
      description: 'Pôsobí tu Banícke bratstvo Herrengrund, udržiavajúce tradície.',
    },
  ],
  4: [
    {
      icon: 'i-lucide-tree-pine',
      title: 'Zaniknutá osada',
      description: 'Piesky boli kedysi živou baníckou osadou, dnes tu stoja len ruiny.',
    },
    {
      icon: 'i-lucide-pickaxe',
      title: 'Banícka minulosť',
      description: 'V okolí sa ťažili medené a strieborné rudy.',
    },
    {
      icon: 'i-lucide-compass',
      title: 'Horský prechod',
      description: 'Leží na hrebeni medzi Špaňou Dolinou a Starými Horami.',
    },
  ],
  5: [
    {
      icon: 'i-lucide-church',
      title: 'Bazilika Minor',
      description: 'Mariánske pútnické miesto s bazilikou z 15. storočia.',
    },
    {
      icon: 'i-lucide-droplets',
      title: 'Studnička',
      description: 'Prameň s údajne liečivou vodou — tradičné pútnické miesto.',
    },
    {
      icon: 'i-lucide-star',
      title: 'Pútnická tradícia',
      description: 'Staré Hory sú najznámejším mariánskym pútnickým miestom v regióne.',
    },
  ],
  6: [
    {
      icon: 'i-lucide-scroll',
      title: '200 rokov papieru',
      description: 'Papier sa tu vyrába nepretržite od roku 1829.',
    },
    {
      icon: 'i-lucide-factory',
      title: 'Papiereň Harmanec',
      description: 'Jeden z najväčších výrobcov papiera v strednej Európe.',
    },
    {
      icon: 'i-lucide-bat',
      title: 'Harmanecká jaskyňa',
      description: 'V blízkosti sa nachádza jaskyňa s kolóniou netopierov.',
    },
  ],
  7: [
    {
      icon: 'i-lucide-mountain-snow',
      title: 'Veľká Fatra',
      description: 'Výhľad na národný park Veľká Fatra z horského penziónu.',
    },
    {
      icon: 'i-lucide-utensils',
      title: 'Horská kuchyňa',
      description: 'Tradičné halušky a domáce koláče v kolibe.',
    },
    {
      icon: 'i-lucide-map-pin',
      title: 'Sv. Krištof',
      description: 'Patrón cestovateľov — vhodné pomenovanie pre pútnickú zastávku.',
    },
  ],
  8: [
    {
      icon: 'i-lucide-flame',
      title: 'Uhliarska obec',
      description: 'Kordíky boli kedysi centrom výroby dreveného uhlia pre hutníctvo.',
    },
    {
      icon: 'i-lucide-home',
      title: 'Horská architektúra',
      description: 'Zachovaná tradičná horská architektúra Kremnických vrchov.',
    },
    {
      icon: 'i-lucide-trees',
      title: 'Kremnické vrchy',
      description: 'Obec leží v srdci sopečného pohoria s bohatou históriou.',
    },
  ],
  9: [
    {
      icon: 'i-lucide-lock',
      title: 'Zlatý poklad',
      description: 'Cez tunel sa počas SNP prevážal zlatý poklad z Kremnice do Národnej banky.',
    },
    {
      icon: 'i-lucide-swords',
      title: 'SNP história',
      description: 'Kľúčové miesto Slovenského národného povstania v roku 1944.',
    },
    {
      icon: 'i-lucide-route',
      title: 'Zlatá cesta',
      description: 'Súčasť historickej Zlatej cesty spájajúcej banské mestá.',
    },
  ],
  10: [
    {
      icon: 'i-lucide-tent',
      title: 'Rekreačné stredisko',
      description: 'Horská chata s ubytovaním pod hrebeňom Kremnických vrchov.',
    },
    {
      icon: 'i-lucide-eye',
      title: 'Výhľady',
      description: 'Panoramatický výhľad na Veľkú Fatru a okolité údolia.',
    },
    {
      icon: 'i-lucide-mountain',
      title: 'Hrebeňovka',
      description: 'Východiskový bod pre hrebeňové túry Kremnickými vrchmi.',
    },
  ],
  11: [
    {
      icon: 'i-lucide-globe',
      title: 'Stred Európy',
      description: 'Neďaleko sa nachádza geografický stred Európy s pamätníkom.',
    },
    {
      icon: 'i-lucide-church',
      title: 'Kostol sv. Jána',
      description: 'Gotický kostol sv. Jána Krstiteľa pri strede Európy.',
    },
    {
      icon: 'i-lucide-users',
      title: 'Nemecká kolonizácia',
      description: 'Obec kedysi osídlená nemeckými baníkmi a remeselníkmi.',
    },
  ],
  12: [
    {
      icon: 'i-lucide-alert-triangle',
      title: 'Šturec',
      description: 'Prepadlisko z 15. storočia — svedok veľkej banskej tragédie.',
    },
    {
      icon: 'i-lucide-gem',
      title: 'Ťažba zlata',
      description: 'Intenzívna ťažba zlata zanechala viditeľné stopy v krajine.',
    },
    {
      icon: 'i-lucide-history',
      title: 'Stredoveká história',
      description: 'Banské bane zásobovali zlato pre Kremnickú mincovňu.',
    },
  ],
  13: [
    {
      icon: 'i-lucide-coins',
      title: 'Najstaršia mincovňa',
      description: 'Nepretržite fungujúca mincovňa od roku 1328 — najstaršia na svete.',
    },
    {
      icon: 'i-lucide-castle',
      title: 'Mestský hrad',
      description: 'Banské múzeum a Múzeum mincí v gotickom hradnom komplexe.',
    },
    {
      icon: 'i-lucide-soup',
      title: 'Kremnické krumple',
      description: 'Tradičné jedlo: zemiaky zapečené s bryndzou a slaninou.',
    },
  ],
  14: [
    {
      icon: 'i-lucide-mountain',
      title: 'Bentonitové lomy',
      description: 'Obec známa ťažbou bentonitu — priemyselného minerálu.',
    },
    {
      icon: 'i-lucide-gate',
      title: 'Vstupná brána',
      description: 'Bod prechodu z Kremnice do údolia smerom na juh.',
    },
    {
      icon: 'i-lucide-compass',
      title: 'Dlhá etapa',
      description: 'Začiatok najdlhšej etapy trasy — 30 km do Sklených Teplíc.',
    },
  ],
  15: [
    {
      icon: 'i-lucide-castle',
      title: 'Šášovský hrad',
      description: 'Ruiny strážneho hradu chránili dôležité obchodné cesty.',
    },
    {
      icon: 'i-lucide-shield',
      title: 'Strážna veža',
      description: 'V stredoveku hrad kontroloval cestu medzi banskými mestami.',
    },
    {
      icon: 'i-lucide-tree-pine',
      title: 'Údolie Hrona',
      description: 'Malebné údolie rieky Hron s výhľadmi na hrad.',
    },
  ],
  16: [
    {
      icon: 'i-lucide-thermometer',
      title: 'Termálne pramene',
      description: 'Kúpeľné mestečko s liečivými termálnymi prameňmi.',
    },
    {
      icon: 'i-lucide-cave',
      title: 'Jaskyňa Parenica',
      description: 'Unikátna jaskyňná kúpeľ — jediná svojho druhu na Slovensku.',
    },
    {
      icon: 'i-lucide-book-open',
      title: 'Prvá vedecká spoločnosť',
      description: 'V 18. storočí tu vznikla prvá vedecká spoločnosť na svete.',
    },
  ],
  17: [
    {
      icon: 'i-lucide-flame',
      title: 'Uhliarska obec',
      description: 'Repište bolo centrom výroby dreveného uhlia.',
    },
    {
      icon: 'i-lucide-castle',
      title: 'Hrad Marcus',
      description: 'Novodobá replika stredovekého hradu v blízkosti obce.',
    },
    {
      icon: 'i-lucide-tree-pine',
      title: 'Štiavnické vrchy',
      description: 'Leží v sopečnom pohorí s unikátnou prírodou.',
    },
  ],
  18: [
    {
      icon: 'i-lucide-award',
      title: 'Mesto UNESCO',
      description: 'Banská Štiavnica je na Zozname svetového dedičstva UNESCO od 1993.',
    },
    {
      icon: 'i-lucide-graduation-cap',
      title: 'Banská akadémia',
      description: 'Prvá technická univerzita na svete (1762).',
    },
    {
      icon: 'i-lucide-droplets',
      title: 'Tajchy',
      description: 'Systém vodných nádrží na pohon banských strojov — technický unikát.',
    },
  ],
  19: [
    {
      icon: 'i-lucide-church',
      title: 'Barokový komplex',
      description: '17 kaplniek a 3 kostoly — jedna z najvýznamnejších pamiatok.',
    },
    {
      icon: 'i-lucide-palette',
      title: '18. storočie',
      description: 'Komplex postavený v 18. storočí v barokovom štýle.',
    },
    {
      icon: 'i-lucide-eye',
      title: 'Panoráma',
      description: 'Výhľad na Banskú Štiavnicu a okolité Štiavnické vrchy.',
    },
  ],
  20: [
    {
      icon: 'i-lucide-castle',
      title: 'Poľovnícky kaštieľ',
      description: 'Sídlo Koháryovcov a Coburgovcov z 18. storočia.',
    },
    {
      icon: 'i-lucide-target',
      title: 'Poľovnícke múzeum',
      description: 'Bohatá poľovnícka expozícia s historickými exponátmi.',
    },
    {
      icon: 'i-lucide-trees',
      title: 'Kaštieľny park',
      description: 'Rozľahlý anglický park s vzácnymi drevinami.',
    },
  ],
  21: [
    {
      icon: 'i-lucide-waves',
      title: 'Tajch na kúpanie',
      description: 'Vodná nádrž premenená na obľúbené kúpalisko.',
    },
    {
      icon: 'i-lucide-sandwich',
      title: 'Domáci langoš',
      description: 'Vynikajúci domáci langoš — tradičné občerstvenie.',
    },
    {
      icon: 'i-lucide-sun',
      title: 'Oddych na trase',
      description: 'Príjemné miesto na odpočinok uprostred 6. etapy.',
    },
  ],
  22: [
    {
      icon: 'i-lucide-mountain',
      title: 'Štiavnické vrchy',
      description: 'Výhľady na údolie Hrona z kopcov pohoria.',
    },
    {
      icon: 'i-lucide-home',
      title: 'Malá obec',
      description: 'Pokojná obec v kopcoch s tradičnou atmosférou.',
    },
    {
      icon: 'i-lucide-footprints',
      title: 'Horská etapa',
      description: 'Časť trasy vedúca cez kopcovitý terén.',
    },
  ],
  23: [
    {
      icon: 'i-lucide-bed',
      title: 'Alberg',
      description: 'Novootvorený komunitný Alberg pre pútnikov — tradícia z Camino.',
    },
    {
      icon: 'i-lucide-castle',
      title: 'Kaštieľ Ostrolúckych',
      description: 'Pamätná izba Adely Ostrolúckej — múzy Ľudovíta Štúra.',
    },
    {
      icon: 'i-lucide-heart',
      title: 'Pútnická komunita',
      description: 'Rastúca komunita dobrovoľníkov starajúcich sa o pútnikov.',
    },
  ],
  24: [
    {
      icon: 'i-lucide-castle',
      title: 'Zvolenský zámok',
      description: 'Gotický kráľovský hrad z roku 1370 s galériou.',
    },
    {
      icon: 'i-lucide-maximize',
      title: 'Veľké námestie',
      description: 'Jedno z najväčších námestí na Slovensku.',
    },
    {
      icon: 'i-lucide-drama',
      title: 'Benátsky kupec',
      description: 'Socha Benátskeho kupca na námestí — symbol obchodu.',
    },
  ],
  25: [
    {
      icon: 'i-lucide-castle',
      title: 'Najväčší hrad',
      description: 'Jeden z najväčších hradných komplexov v Európe.',
    },
    {
      icon: 'i-lucide-mountain',
      title: 'Via ferrata',
      description: 'Zaistená cesta Sokolie skaly — adrenalínový zážitok.',
    },
    {
      icon: 'i-lucide-utensils',
      title: 'Koliba U Rytiera',
      description: 'Reštaurácia s výhľadom na hrad a grilované špeciality.',
    },
  ],
  26: [
    {
      icon: 'i-lucide-thermometer',
      title: 'Liečivé kúpele',
      description: 'Kardiologické kúpele s termálnymi prameňmi.',
    },
    {
      icon: 'i-lucide-droplets',
      title: 'Prameň Štefánik',
      description: 'Minerálna voda zo zdroja Štefánik — voľne prístupná.',
    },
    {
      icon: 'i-lucide-heart-pulse',
      title: 'Kardiológia',
      description: 'Špecializované kúpele na liečbu srdcovo-cievnych ochorení.',
    },
  ],
  27: [
    {
      icon: 'i-lucide-church',
      title: 'Benediktíni',
      description: 'Kláštor Premenenia Pána — duchovné centrum benediktínov.',
    },
    {
      icon: 'i-lucide-candle',
      title: 'Duchovné zastavenie',
      description: 'Pokojné miesto na meditáciu a zastavenie sa.',
    },
    {
      icon: 'i-lucide-book-open',
      title: 'Kláštorná tradícia',
      description: 'Benediktínska tradícia pohostinnosti voči pútnikom.',
    },
  ],
  28: [
    {
      icon: 'i-lucide-award',
      title: 'UNESCO kostol',
      description: 'Drevený artikulárny kostol z 1726 — postavený bez klincov.',
    },
    {
      icon: 'i-lucide-castle',
      title: 'Vodný hrad',
      description: 'Hrad zo 14. storočia obklopený vodou — unikát v regióne.',
    },
    {
      icon: 'i-lucide-coins',
      title: 'Rákociho mince',
      description: 'V hrade sa razili mince pre Františka II. Rákociho.',
    },
  ],
  29: [
    {
      icon: 'i-lucide-telescope',
      title: 'Hvezdáreň',
      description: 'Hvezdáreň na mieste bývalej strážnej veže proti Turkom.',
    },
    {
      icon: 'i-lucide-church',
      title: 'Kalvária a Urpín',
      description: 'Banskobystricá Kalvária a vrch Urpín — symbol mesta.',
    },
    {
      icon: 'i-lucide-flag',
      title: '193 km!',
      description: 'Koniec púte — 193 kilometrov baníckou krajinou!',
    },
  ],
}

const facts = computed<Fact[]>(() => {
  return (
    factsDb[props.stopId] ?? [
      { icon: 'i-lucide-info', title: stop.value?.name ?? '', description: stop.value?.desc ?? '' },
      {
        icon: 'i-lucide-map-pin',
        title: 'Na trase',
        description: 'Zastávka na Barborskej ceste — 193 km pútnickej trasy.',
      },
      {
        icon: 'i-lucide-footprints',
        title: 'Pútnicka tradícia',
        description: 'Banícka pútnická cesta spájajúca mestá stredného Slovenska.',
      },
    ]
  )
})
</script>
