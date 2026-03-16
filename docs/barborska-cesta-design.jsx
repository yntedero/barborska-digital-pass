import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin, Navigation, ChevronRight, ChevronLeft, Check, X, Sun, Moon,
  Smartphone, Monitor, Menu, Globe, Map, Compass, BookOpen,
  Search, Phone, Clock, Shield, Droplets, Utensils,
  Bed, Bike, Car, Heart, AlertTriangle,
  Download, RefreshCw, Milestone, Stamp,
  CircleCheck, Lock, ArrowUpRight,
  ArrowDownRight, Share2, TreePine, Wind
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   BARBORSKÁ CESTA — DIGITAL TRAIL GUIDE
   Heritage Craft · Real Leaflet Maps · All Pages
   ═══════════════════════════════════════════════════ */

// ── REAL GPS DATA (29 stops from official brochure + real coordinates) ──
const STOPS = [
  // === ETAPA 1: Banská Bystrica → Staré Hory (24.5 km) ===
  { id:1,  name:"Banská Bystrica",     stage:1, lat:48.7362, lng:19.1462, desc:"Štartovací bod púte pri Kostole Nanebovzatia Panny Márie. V hradnom komplexe Barbakan nájdete Thurzo-Fugger zážitkovú expozíciu o histórii najväčšej spoločnosti na spracovanie medi v stredovekej Európe.", validated:true, checkedIn:true, fac:["wc","water","food","bed","bike","parking","medical"] },
  { id:2,  name:"Jakub",               stage:1, lat:48.7580, lng:19.1125, desc:"Mestská časť Banskej Bystrice s Kostolom sv. Jakuba. Odtiaľto začína stúpanie na najdlhšiu krížovú cestu v bývalom Hornom Uhorsku vedúcu na Španiu Dolinu.", validated:true, checkedIn:true, fac:["water"] },
  { id:3,  name:"Špania Dolina",       stage:1, lat:48.7828, lng:19.1283, desc:"Pamiatková rezervácia ľudového staviteľstva s Múzeom medi. Medené bane tu fungovali od 10. storočia. Pôsobí tu Banícke bratstvo Herrengrund.", validated:false, checkedIn:true, fac:["wc","water","food","bed","parking"] },
  { id:4,  name:"Piesky",              stage:1, lat:48.8050, lng:19.0870, desc:"Zaniknutá banská osada v horách medzi Špaňou Dolinou a Starými Horami. Miesto s bohatou baníckou minulosťou.", validated:true, checkedIn:true, fac:["water","shelter"] },
  { id:5,  name:"Staré Hory",          stage:1, lat:48.7883, lng:19.0528, desc:"Známe mariánske pútnické miesto s Bazilikou Minor a prameňom Studnička, ktorý má podľa legendy liečivé účinky.", checkedIn:false, fac:["wc","water","food","bed","parking"] },
  // === ETAPA 2: Staré Hory → Skalka (30.5 km) ===
  { id:6,  name:"Harmanec",            stage:2, lat:48.8205, lng:19.0345, desc:"Obec, kde sa už takmer 200 rokov vyrába papier. Papiereň Harmanec je dnes jedným z najväčších výrobcov v strednej Európe.", checkedIn:false, fac:["water","food"] },
  { id:7,  name:"Koliba u sv. Krištofa", stage:2, lat:48.8100, lng:19.0050, desc:"Horský penzión na trase medzi Harmancom a Kordíkmi. Príjemné miesto na občerstvenie s výhľadom na Veľkú Fatru.", checkedIn:false, fac:["food","bed","water"] },
  { id:8,  name:"Kordíky",             stage:2, lat:48.7920, lng:18.9780, desc:"Bývalá uhliarska obec v srdci Kremnických vrchov. Zachovalá tradičná horská architektúra.", checkedIn:false, fac:["water","shelter"] },
  { id:9,  name:"Görgeyho tunel",      stage:2, lat:48.7800, lng:18.9500, desc:"Historický tunel, ktorý zohral kľúčovú úlohu počas SNP — prevážal sa cezeň zlatý poklad z Kremnice do Národnej banky v BB. Súčasť Zlatej cesty.", checkedIn:false, fac:["shelter"] },
  { id:10, name:"Skalka",              stage:2, lat:48.7750, lng:18.9350, desc:"Rekreačné stredisko pod hrebeňom Kremnických vrchov. Chata na Skalke ponúka ubytovanie a výhľady na Veľkú Fatru.", checkedIn:false, fac:["water","food","bed","shelter"] },
  // === ETAPA 3: Skalka → Kremnica (20 km) ===
  { id:11, name:"Krahule",             stage:3, lat:48.7480, lng:18.9200, desc:"Obec kedysi osídlená nemeckými obyvateľmi. Neďaleko sa nachádza Kostol sv. Jána Krstiteľa v geografickom strede Európy.", checkedIn:false, fac:["water","food","bed"] },
  { id:12, name:"Kremnické Bane",      stage:3, lat:48.7330, lng:18.9230, desc:"Obec s prepadliskom Šturec — miesto veľkej banskej tragédie z 15. storočia. Zachované stopy po intenzívnej ťažbe zlata.", checkedIn:false, fac:["water"] },
  { id:13, name:"Kremnica",            stage:3, lat:48.7053, lng:18.9163, desc:"Najstaršia nepretržite fungujúca mincovňa na svete (od 1328). Múzeum mincí, Banské múzeum, mestský hrad. Ochutnajte Kremnické krumple.", checkedIn:false, fac:["wc","water","food","bed","bike","parking","medical"] },
  // === ETAPA 4: Kremnica → Sklené Teplice (30 km) ===
  { id:14, name:"Horná Ves",           stage:4, lat:48.6880, lng:18.9050, desc:"Obec pri Kremnici s bentonitovými lomami. Vstupná brána do údolia smerom na juh.", checkedIn:false, fac:["water"] },
  { id:15, name:"Šášovské Podhradie",  stage:4, lat:48.6440, lng:18.8540, desc:"Ruiny Šášovského hradu, ktorý v stredoveku plnil funkciu strážneho hradu dôležitých obchodných ciest.", checkedIn:false, fac:["water","shelter"] },
  { id:16, name:"Sklené Teplice",      stage:4, lat:48.5300, lng:18.7400, desc:"Kúpeľné mestečko s termálnymi prameňmi. Unikátna jaskyňná kúpeľ Parenica. V 18. storočí tu vznikla prvá vedecká spoločnosť na svete.", checkedIn:false, fac:["wc","water","food","bed","parking"] },
  // === ETAPA 5: Sklené Teplice → Banská Štiavnica (12.8 km) ===
  { id:17, name:"Repište",             stage:5, lat:48.4900, lng:18.8200, desc:"Bývalá uhliarska obec. Neďaleko sa nachádza Hrad Marcus — novodobá replika stredovekého hradu.", checkedIn:false, fac:["water","shelter"] },
  { id:18, name:"Banská Štiavnica",    stage:5, lat:48.4589, lng:18.8964, desc:"Mesto UNESCO. Starý a Nový zámok, Kalvária, Banská akadémia, tajchy. Multimediálna expozícia Cesta v čase a Banský skanzen.", checkedIn:false, fac:["wc","water","food","bed","bike","parking","medical"] },
  // === ETAPA 6: Banská Štiavnica → Ostrá Lúka (26.7 km) ===
  { id:19, name:"Banskoštiavnická kalvária", stage:6, lat:48.4620, lng:18.8920, desc:"Barokový komplex z 18. storočia so 17 kaplnkami a 3 kostolmi — jedna z najvýznamnejších pamiatok regiónu.", checkedIn:false, fac:["water"] },
  { id:20, name:"Svätý Anton",         stage:6, lat:48.4300, lng:18.9300, desc:"Poľovnícky kaštieľ z 18. storočia, bývalé sídlo Koháryovcov a Coburgovcov. Dnes múzeum s bohatou poľovníckou expozíciou.", checkedIn:false, fac:["wc","water","food","parking"] },
  { id:21, name:"Banský Studenec",     stage:6, lat:48.4500, lng:18.9700, desc:"Obec s tajchom na kúpanie a vynikajúcim domácim langošom. Príjemný oddych uprostred trasy.", checkedIn:false, fac:["water","food"] },
  { id:22, name:"Bacúrov",             stage:6, lat:48.5050, lng:19.0350, desc:"Malá obec v kopcoch Štiavnických vrchov s výhľadmi na údolie Hrona.", checkedIn:false, fac:["water"] },
  { id:23, name:"Ostrá Lúka",          stage:6, lat:48.5300, lng:19.0600, desc:"Obec s novootvoreným komunitným Albergom pre pútnikov. Kaštieľ Ostrolúckych — Pamätná izba Adely Ostrolúckej.", checkedIn:false, fac:["water","food","bed","shelter"] },
  // === ETAPA 7: Ostrá Lúka → Zvolen (15 km) ===
  { id:24, name:"Zvolen",              stage:7, lat:48.5764, lng:19.1514, desc:"Zvolenský zámok — gotický kráľovský hrad z roku 1370. Jedno z najväčších námestí na Slovensku. Socha Benátskeho kupca.", checkedIn:false, fac:["wc","water","food","bed","bike","parking","medical"] },
  { id:25, name:"Pustý Hrad",          stage:7, lat:48.5650, lng:19.1300, desc:"Jeden z najväčších hradných komplexov v Európe nad Zvolenom. Via ferrata Sokolie skaly. Koliba U Rytiera.", checkedIn:false, fac:["water","shelter"] },
  // === ETAPA 8: Zvolen → Vlkanová (23.5 km) ===
  { id:26, name:"Sliač",               stage:8, lat:48.6095, lng:19.1445, desc:"Kúpeľné mesto s liečivými termálnymi prameňmi (kardiológia). Minerálna voda zo zdroja Štefánik.", checkedIn:false, fac:["wc","water","food","bed","parking"] },
  { id:27, name:"Kláštor Sampor",      stage:8, lat:48.6200, lng:19.1350, desc:"Kláštor Premenenia Pána, o ktorý sa starajú benediktíni. Pokojné miesto duchovného zastavenia.", checkedIn:false, fac:["water","shelter"] },
  { id:28, name:"Hronsek",             stage:8, lat:48.6400, lng:19.1600, desc:"Drevený artikulárny kostol UNESCO z roku 1726 — unikát bez klinca. Vodný hrad zo 14. storočia (Géczyovci, Rákocziho mince).", checkedIn:false, fac:["water","parking","food"] },
  // === ETAPA 9: Vlkanová → Banská Bystrica (13.3 km) ===
  { id:29, name:"Vartovka",            stage:9, lat:48.7250, lng:19.1380, desc:"Hvezdáreň na mieste bývalej strážnej veže, ktorá chránila región pred Turkami. Banskobystricka Kalvária a Urpín. Koniec púte — 193 km!", checkedIn:false, fac:["water","shelter"] },
];

const SERVICES = [
  // Banská Bystrica area
  { id:1, name:"Penzión Kúria", cat:"bed", stop:"Banská Bystrica", stopId:1, lat:48.7375, lng:19.1480, dist:"150 m", pilgrim:true, phone:"+421 901 234 567", hours:"Non-stop", desc:"Rodinný penzión s raňajkami pre pútnikov v historickom centre. Tichá záhrada a sušiareň obuvi." },
  { id:2, name:"Reštaurácia Pod Urpínom", cat:"food", stop:"Banská Bystrica", stopId:1, lat:48.7350, lng:19.1440, dist:"200 m", pilgrim:false, phone:"+421 902 345 678", hours:"10:00–22:00", desc:"Tradičná slovenská kuchyňa s lokálnymi surovinami. Obedné menu pre pútnikov." },
  { id:3, name:"Cykloservis BB", cat:"bike", stop:"Banská Bystrica", stopId:1, lat:48.7340, lng:19.1500, dist:"500 m", pilgrim:true, phone:"+421 903 456 789", hours:"Po–Pi 8:00–17:00", desc:"Oprava bicyklov a e-bicyklov, nabíjanie batérií, požičovňa." },
  { id:4, name:"TIC Banská Bystrica", cat:"water", stop:"Banská Bystrica", stopId:1, lat:48.7360, lng:19.1455, dist:"50 m", pilgrim:true, phone:"+421 48 415 5085", hours:"9:00–17:00", desc:"Turistické informačné centrum. Predaj pútnických pasov, pečiatky, informácie o trase." },
  // Špania Dolina
  { id:5, name:"Múzeum medi", cat:"food", stop:"Špania Dolina", stopId:3, lat:48.7835, lng:19.1275, dist:"50 m", pilgrim:true, phone:"+421 905 111 222", hours:"10:00–16:00", desc:"Občerstvenie pri Múzeu medi. Lokálne produkty a nápoje." },
  // Staré Hory
  { id:6, name:"Alberg Staré Hory", cat:"bed", stop:"Staré Hory", stopId:5, lat:48.7890, lng:19.0540, dist:"50 m", pilgrim:true, phone:"+421 904 567 890", hours:"15:00–21:00", desc:"Komunálna pútnická ubytovňa. Matrac, deka, vlastný spacák. Kuchynka a spoločenský priestor." },
  { id:7, name:"Penzión Bazilika", cat:"bed", stop:"Staré Hory", stopId:5, lat:48.7878, lng:19.0520, dist:"100 m", pilgrim:false, phone:"+421 904 333 444", hours:"Non-stop", desc:"Penzión s raňajkami pri bazilike. Komfortné izby, reštaurácia." },
  { id:8, name:"Studnička – prameň", cat:"water", stop:"Staré Hory", stopId:5, lat:48.7895, lng:19.0535, dist:"80 m", pilgrim:false, phone:"", hours:"24/7", desc:"Prameň s údajne liečivou vodou pri bazilike. Tradičné pútnické miesto." },
  // Harmanec – Kordíky area
  { id:9, name:"Koliba u sv. Krištofa", cat:"food", stop:"Koliba u sv. Krištofa", stopId:7, lat:48.8105, lng:19.0055, dist:"0 m", pilgrim:true, phone:"+421 905 222 333", hours:"11:00–20:00", desc:"Horský penzión s reštauráciou. Halušky, pirohy, domáce koláče. Ubytovanie pre pútnikov." },
  // Skalka
  { id:10, name:"Chata na Skalke", cat:"bed", stop:"Skalka", stopId:10, lat:48.7755, lng:18.9360, dist:"50 m", pilgrim:true, phone:"+421 905 444 555", hours:"Non-stop", desc:"Horská chata s ubytovaním a reštauráciou. Výhľady na Veľkú Fatru. Sušiareň a cykloservis." },
  // Krahule
  { id:11, name:"Ubytovanie Krahule", cat:"bed", stop:"Krahule", stopId:11, lat:48.7485, lng:18.9210, dist:"100 m", pilgrim:true, phone:"+421 906 555 666", hours:"Non-stop", desc:"Jednoduché ubytovanie v obci Krahule. Kuchynka, spoločenský priestor." },
  { id:12, name:"Stred Európy – prameň", cat:"water", stop:"Krahule", stopId:11, lat:48.7470, lng:18.9180, dist:"300 m", pilgrim:false, phone:"", hours:"24/7", desc:"Prameň Európa pri geografickom strede Európy. Symbolické miesto s informačnou tabuľou." },
  // Kremnica
  { id:13, name:"Hotel Goldenvald", cat:"bed", stop:"Kremnica", stopId:13, lat:48.7060, lng:18.9175, dist:"200 m", pilgrim:false, phone:"+421 906 789 012", hours:"Non-stop", desc:"Hotel v centre Kremnice. Reštaurácia s tradičnou kuchyňou, Kremnické krumple." },
  { id:14, name:"Prameň sv. Barbory", cat:"water", stop:"Kremnica", stopId:13, lat:48.7050, lng:18.9180, dist:"30 m", pilgrim:false, phone:"", hours:"24/7", desc:"Pitná voda z prírodného prameňa priamo pri ceste v centre mesta." },
  { id:15, name:"Kremnická mincovňa – kaviareň", cat:"food", stop:"Kremnica", stopId:13, lat:48.7048, lng:18.9160, dist:"150 m", pilgrim:false, phone:"+421 45 678 1111", hours:"9:00–17:00", desc:"Kaviareň v areáli mincovne. Káva, zákusky, suveníry. Pečiatka pre pútnikov." },
  // Sklené Teplice
  { id:16, name:"Kúpele Sklené Teplice", cat:"medical", stop:"Sklené Teplice", stopId:16, lat:48.5310, lng:18.7410, dist:"100 m", pilgrim:false, phone:"+421 908 901 234", hours:"8:00–20:00", desc:"Termálne kúpele s jaskyňnou kúpeľou Parenica. Relaxácia pre unavených pútnikov." },
  { id:17, name:"Penzión Javorina", cat:"bed", stop:"Sklené Teplice", stopId:16, lat:48.5305, lng:18.7390, dist:"150 m", pilgrim:true, phone:"+421 907 666 777", hours:"Non-stop", desc:"Penzión s reštauráciou a wellness v kúpeľnom mestečku." },
  // Banská Štiavnica
  { id:18, name:"Hotel Salamander", cat:"bed", stop:"Banská Štiavnica", stopId:18, lat:48.4595, lng:18.8950, dist:"300 m", pilgrim:false, phone:"+421 906 789 012", hours:"Non-stop", desc:"Historický hotel v centre UNESCO mesta. Reštaurácia, wellness, výhľad na Kalváriu." },
  { id:19, name:"Pivný bar Erb", cat:"food", stop:"Banská Štiavnica", stopId:18, lat:48.4585, lng:18.8970, dist:"200 m", pilgrim:false, phone:"+421 908 777 888", hours:"11:00–23:00", desc:"Remeselné pivá a tradičné jedlá na Námestí Trojice. Lokálne suroviny." },
  { id:20, name:"Banský skanzen", cat:"water", stop:"Banská Štiavnica", stopId:18, lat:48.4570, lng:18.8930, dist:"500 m", pilgrim:false, phone:"+421 45 692 0571", hours:"9:00–17:00", desc:"Banský skanzen v prírode. Pitná voda, WC, pečiatka. Vstup do štôlne Bartolomej." },
  // Svätý Anton
  { id:21, name:"Kaštieľ Sv. Anton", cat:"food", stop:"Svätý Anton", stopId:20, lat:48.4305, lng:18.9310, dist:"50 m", pilgrim:true, phone:"+421 45 691 4814", hours:"9:00–17:00", desc:"Občerstvenie v areáli kaštieľa. Poľovnícka expozícia, park, pečiatka." },
  // Ostrá Lúka
  { id:22, name:"Alberg Ostrá Lúka", cat:"bed", stop:"Ostrá Lúka", stopId:23, lat:48.5305, lng:19.0610, dist:"50 m", pilgrim:true, phone:"+421 908 888 999", hours:"15:00–21:00", desc:"Novootvorený komunitný Alberg pre pútnikov. Spoločná spálňa, kuchynka, sušiareň." },
  // Zvolen
  { id:23, name:"Koliba U Rytiera", cat:"food", stop:"Zvolen", stopId:24, lat:48.5700, lng:19.1400, dist:"2 km", pilgrim:true, phone:"+421 907 890 123", hours:"10:00–21:00", desc:"Koliba pod Pustým hradom. Grilované špeciality, lokálne pivá, výhľad na hrad." },
  { id:24, name:"Hotel Poľana", cat:"bed", stop:"Zvolen", stopId:24, lat:48.5770, lng:19.1520, dist:"200 m", pilgrim:false, phone:"+421 45 533 0811", hours:"Non-stop", desc:"Hotel v centre Zvolena pri námestí. Reštaurácia, parkovanie." },
  // Sliač
  { id:25, name:"Kúpele Sliač", cat:"medical", stop:"Sliač", stopId:26, lat:48.6100, lng:19.1460, dist:"200 m", pilgrim:false, phone:"+421 45 544 1111", hours:"8:00–20:00", desc:"Liečivé termálne kúpele, kardiologická liečba. Minerálny prameň Štefánik." },
  // Hronsek  
  { id:26, name:"Vodný hrad Hronsek", cat:"bed", stop:"Hronsek", stopId:28, lat:48.6405, lng:19.1610, dist:"100 m", pilgrim:false, phone:"+421 905 999 111", hours:"Rezervácia", desc:"Historický Vodný hrad zo 14. storočia. Ubytovanie v zrekonštruovanom kaštieli." },
  // Bike services
  { id:27, name:"Cykloservis Zvolen", cat:"bike", stop:"Zvolen", stopId:24, lat:48.5780, lng:19.1530, dist:"300 m", pilgrim:true, phone:"+421 903 222 111", hours:"Po–Pi 9:00–17:00", desc:"Oprava bicyklov, náhradné diely, nabíjanie e-bicyklov." },
  // Shelters
  { id:28, name:"Prístrešok Görgeyho tunel", cat:"shelter", stop:"Görgeyho tunel", stopId:9, lat:48.7805, lng:18.9510, dist:"20 m", pilgrim:true, phone:"", hours:"24/7", desc:"Prístrešok s lavičkami pri historickom tuneli. Informačná tabuľa o Zlatej ceste." },
  { id:29, name:"Bivak Pustý Hrad", cat:"shelter", stop:"Pustý Hrad", stopId:25, lat:48.5655, lng:19.1310, dist:"50 m", pilgrim:true, phone:"", hours:"24/7", desc:"Prístrešok na hrade s ohniskom. Panoramatický výhľad na Zvolen a Poľanu." },
];

const FACS = { wc:"🚻", water:"💧", food:"🍽️", bed:"🛏️", bike:"🔧", parking:"🅿️", medical:"⛑️", shelter:"⛺" };
const FAC_N = { wc:"WC", water:"Voda", food:"Jedlo", bed:"Nocľah", bike:"Cyklo", parking:"Parking", medical:"Pomoc", shelter:"Prístrešok" };
const CAT_N = { bed:"Ubytovanie", food:"Jedlo a nápoje", water:"Pitná voda", bike:"Cykloservis", shelter:"Prístrešok", medical:"Zdravotná pomoc" };
const CAT_I = { bed:Bed, food:Utensils, water:Droplets, bike:Bike, shelter:TreePine, medical:Heart };
const CAT_CLR = { bed:"#d4843a", food:"#c49225", water:"#4a90d9", bike:"#6a9e5c", shelter:"#7a6e5a", medical:"#c45c4a" };
const STAGES_N = ["BB → Staré Hory (24,5 km)","Staré Hory → Skalka (30,5 km)","Skalka → Kremnica (20 km)","Kremnica → Skl. Teplice (30 km)","Skl. Teplice → B. Štiavnica (12,8 km)","B. Štiavnica → Ostrá Lúka (26,7 km)","Ostrá Lúka → Zvolen (15 km)","Zvolen → Vlkanová (23,5 km)","Vlkanová → BB (13,3 km)"];

const themes = {
  light: { bg:"#f5f0e8",card:"#ffffff",surface:"#ece5d8",accent:"#f8f4ec",text:"#2c2416",text2:"#6b5d4a",text3:"#9a8c78",gold:"#c49225",goldL:"#d4a843",green:"#4a7c3a",greenBg:"#e8f0e4",red:"#b94434",redBg:"#f5e8e4",amber:"#c49638",amberBg:"#f8f0d8",border:"#ddd4c4",borderL:"#e8e0d0",shadow:"0 2px 12px rgba(44,36,22,0.08)" },
  dark: { bg:"#1a1714",card:"#252118",surface:"#1f1c17",accent:"#2a2419",text:"#e8dcc8",text2:"#a89a82",text3:"#7a6e5a",gold:"#d4a843",goldL:"#e8c86a",green:"#6a9e5c",greenBg:"#2a3325",red:"#c45c4a",redBg:"#332520",amber:"#c49638",amberBg:"#332e1e",border:"#3a3228",borderL:"#2e2820",shadow:"0 2px 12px rgba(0,0,0,0.4)" }
};

// ═══════════════════════════════════
// LEAFLET MAP COMPONENT
// ═══════════════════════════════════

function LeafletMap({ t, mobile, stops, services, selectedStop, onSelectStop, onSelectService, height, showAllStops = true, showServices = true, centerLat, centerLng, zoom }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (!mapRef.current || !window.L) return;

    const L = window.L;
    const cLat = centerLat || 48.65;
    const cLng = centerLng || 19.05;
    const z = zoom || (showAllStops ? 10 : 14);

    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: true }).setView([cLat, cLng], z);
    mapInstanceRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    // Trail polyline
    const trailCoords = stops.map(s => [s.lat, s.lng]);
    L.polyline(trailCoords, { color: "#c49225", weight: 4, opacity: 0.85, dashArray: "10, 6", lineJoin: "round" }).addTo(map);

    // Stop markers
    const stopsToShow = showAllStops ? stops : stops.filter(s => {
      if (!selectedStop) return true;
      return Math.abs(s.id - selectedStop.id) <= 1;
    });

    stopsToShow.forEach(s => {
      const isActive = selectedStop && s.id === selectedStop.id;
      const col = s.validated ? "#c49225" : s.checkedIn ? "#c49638" : "#ffffff";
      const border = s.validated ? "#a67b1a" : s.checkedIn ? "#a67b1a" : "#6b5d4a";
      const size = isActive ? 18 : 12;

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${col};border:2.5px solid ${border};box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:${isActive?9:7}px;font-weight:700;color:${s.validated||s.checkedIn?'#1a1714':'#6b5d4a'};cursor:pointer;${isActive?'animation:pulse 2s infinite;':''}"><style>@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(196,146,37,0.4)}50%{box-shadow:0 0 0 8px rgba(196,146,37,0)}}</style>${s.id}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });

      const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Source Sans 3',sans-serif;min-width:200px;padding:4px">
          <div style="font-size:11px;color:#9a8c78;margin-bottom:2px">Zastávka ${s.id} z 29 · Etapa ${s.stage}</div>
          <div style="font-family:'Crimson Pro',serif;font-size:17px;font-weight:700;color:#2c2416;margin-bottom:6px">${s.name}</div>
          <div style="font-size:12px;color:#6b5d4a;line-height:1.5;margin-bottom:10px">${s.desc.slice(0,100)}...</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">${(s.fac||[]).map(f=>`<span style="font-size:14px" title="${FAC_N[f]||f}">${FACS[f]||"?"}</span>`).join("")}</div>
          <div style="font-size:11px;color:#9a8c78">${s.validated?"🏅 GPS overená návšteva":s.checkedIn?"🟡 Navštívené":"○ Nenavštívené"}</div>
        </div>
      `, { maxWidth: 280 });
      marker.on("click", () => onSelectStop && onSelectStop(s));
      markersRef.current.push(marker);
    });

    // Service markers
    if (showServices) {
      services.forEach(svc => {
        if (!svc.lat || !svc.lng) return;
        const c = CAT_CLR[svc.cat] || "#6b5d4a";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:10px;height:10px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer"></div>`,
          iconSize: [10, 10], iconAnchor: [5, 5],
        });
        const m = L.marker([svc.lat, svc.lng], { icon }).addTo(map);
        m.bindPopup(`
          <div style="font-family:'Source Sans 3',sans-serif;min-width:180px;padding:4px">
            <div style="font-size:11px;color:${c};font-weight:600;margin-bottom:2px">${CAT_N[svc.cat]}</div>
            <div style="font-size:15px;font-weight:700;color:#2c2416;margin-bottom:4px">${svc.name}</div>
            <div style="font-size:12px;color:#6b5d4a;margin-bottom:4px">${svc.desc.slice(0,80)}...</div>
            <div style="font-size:11px;color:#9a8c78">📍 ${svc.stop} · ${svc.dist}</div>
            ${svc.pilgrim?'<div style="font-size:11px;color:#c49225;margin-top:4px;font-weight:600">⛏ Pútnik-friendly</div>':''}
          </div>
        `);
        m.on("click", () => onSelectService && onSelectService(svc));
      });
    }

    // User location marker (simulated near current stop)
    if (selectedStop) {
      const userLat = selectedStop.lat + 0.001;
      const userLng = selectedStop.lng - 0.0015;
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="position:relative"><div style="width:14px;height:14px;border-radius:50%;background:#4a90d9;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div><div style="position:absolute;top:-5px;left:-5px;width:24px;height:24px;border-radius:50%;background:rgba(74,144,217,0.2);animation:pulse2 2s infinite"></div><style>@keyframes pulse2{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.8);opacity:0}}</style></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      });
      L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup(`<div style="font-family:'Source Sans 3',sans-serif;font-size:13px;color:#4a90d9;font-weight:600">📍 Vaša poloha</div>`);
    }

    setTimeout(() => map.invalidateSize(), 100);

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [t.bg, selectedStop?.id, showAllStops, centerLat, centerLng, zoom]);

  return <div ref={mapRef} style={{ width:"100%", height: height || 300, borderRadius: 0 }} />;
}

// ═══════════════════════════════════
// MAIN APP
// ═══════════════════════════════════
export default function App() {
  const [dark, setDark] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [page, setPage] = useState("gdpr");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stop, setStop] = useState(STOPS[10]);
  const [selSvc, setSelSvc] = useState(null);
  const [svcFilter, setSvcFilter] = useState([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const t = dark ? themes.dark : themes.light;
  const hd = `'Crimson Pro', Georgia, serif`;
  const bd = `'Source Sans 3', 'Segoe UI', sans-serif`;
  const go = (p) => { setPage(p); setMenuOpen(false); setSelSvc(null); };

  // Load Leaflet
  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    js.onload = () => setLeafletLoaded(true);
    document.head.appendChild(js);
  }, []);

  return (
    <div style={{ fontFamily:bd, background:"#1a1714", minHeight:"100vh", color:t.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {/* ═══ TOOLBAR ═══ */}
      <div style={{ background:"#1a1714", borderBottom:"1px solid #3a3228", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:1000, flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#d4a843", fontFamily:hd, fontWeight:700, fontSize:15 }}>⛏️ Barborská cesta</span>
          <span style={{ color:"#7a6e5a", fontSize:11 }}>Design</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
          {[[Monitor,"PC",!mobile,()=>setMobile(false)],[Smartphone,"Mobile",mobile,()=>setMobile(true)]].map(([I,l,a,fn],i)=>(
            <button key={i} onClick={fn} style={{ background:a?"#2a2419":"transparent", border:"1px solid #3a3228", borderRadius:6, padding:"5px 8px", color:a?"#d4a843":"#7a6e5a", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:11 }}><I size={12}/>{l}</button>
          ))}
          <div style={{ width:1, height:16, background:"#3a3228" }}/>
          {[[Sun,"Light",!dark,()=>setDark(false)],[Moon,"Dark",dark,()=>setDark(true)]].map(([I,l,a,fn],i)=>(
            <button key={i} onClick={fn} style={{ background:a?"#2a2419":"transparent", border:"1px solid #3a3228", borderRadius:6, padding:"5px 8px", color:a?"#e8c86a":"#7a6e5a", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:11 }}><I size={12}/>{l}</button>
          ))}
          <div style={{ width:1, height:16, background:"#3a3228" }}/>
          <button onClick={()=>{setIsAdmin(false);go("stop")}} style={{ background:!isAdmin?"#2a2419":"transparent", border:"1px solid #3a3228", borderRadius:6, padding:"5px 8px", color:!isAdmin?"#6a9e5c":"#7a6e5a", cursor:"pointer", fontSize:11 }}>Návštevník</button>
          <button onClick={()=>{setIsAdmin(true);go("admin")}} style={{ background:isAdmin?"#2a2419":"transparent", border:"1px solid #3a3228", borderRadius:6, padding:"5px 8px", color:isAdmin?"#d4a843":"#7a6e5a", cursor:"pointer", fontSize:11 }}>Admin</button>
        </div>
      </div>

      {/* ═══ FRAME ═══ */}
      <div style={{ display:"flex", justifyContent:"center", padding:mobile?"20px 0":20, background:dark?"#111":"#d5cdc0", minHeight:"calc(100vh - 54px)" }}>
        <div style={{ width:mobile?390:"100%", maxWidth:mobile?390:1200, background:t.bg, borderRadius:mobile?24:12, overflow:"hidden", position:"relative", boxShadow:mobile?"0 0 0 8px #2a2419, 0 20px 60px rgba(0,0,0,0.3)":t.shadow, minHeight:mobile?780:600 }}>
          {mobile && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:120, height:28, background:"#1a1714", borderRadius:"0 0 16px 16px", zIndex:50 }}/>}

          {page !== "gdpr" && <Header t={t} hd={hd} bd={bd} mobile={mobile} isAdmin={isAdmin} page={page} go={go} menuOpen={menuOpen} setMenuOpen={setMenuOpen} adminTab={adminTab} setAdminTab={setAdminTab}/>}

          <div style={{ overflowY:"auto", maxHeight:mobile?680:"calc(100vh - 160px)", paddingTop:page==="gdpr"?(mobile?36:0):0 }}>
            {page==="gdpr" && <GDPR t={t} hd={hd} bd={bd} mobile={mobile} onAccept={()=>go("stop")} onDecline={()=>go("stop")}/>}
            {page==="stop" && <StopPg t={t} hd={hd} bd={bd} mobile={mobile} stop={stop} setStop={setStop} goMap={()=>go("map")} leaflet={leafletLoaded}/>}
            {page==="services" && !selSvc && <SvcPg t={t} hd={hd} bd={bd} mobile={mobile} filter={svcFilter} setFilter={setSvcFilter} onSelect={setSelSvc}/>}
            {page==="services" && selSvc && <SvcDet t={t} hd={hd} bd={bd} mobile={mobile} svc={selSvc} onBack={()=>setSelSvc(null)} leaflet={leafletLoaded}/>}
            {page==="passport" && <Passport t={t} hd={hd} bd={bd} mobile={mobile}/>}
            {page==="map" && <MapFull t={t} hd={hd} bd={bd} mobile={mobile} leaflet={leafletLoaded} onSelect={(s)=>{setStop(s);go("stop")}}/>}
            {page==="admin" && <Admin t={t} hd={hd} bd={bd} mobile={mobile} tab={adminTab} setTab={setAdminTab}/>}
          </div>

          {mobile && !isAdmin && page!=="gdpr" && (
            <div style={{ position:"absolute", bottom:0, left:0, right:0, background:t.card, borderTop:`1px solid ${t.border}`, display:"flex", justifyContent:"space-around", padding:"6px 0 14px", zIndex:40 }}>
              {[[MapPin,"Zastávky","stop"],[Compass,"Služby","services"],[Map,"Mapa","map"],[BookOpen,"Pas","passport"]].map(([I,l,id])=>(
                <button key={id} onClick={()=>go(id)} style={{ background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, color:page===id?t.gold:t.text3, padding:"4px 12px" }}>
                  <I size={20} strokeWidth={page===id?2.2:1.5}/><span style={{ fontSize:10, fontWeight:page===id?600:400 }}>{l}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ HEADER ═══
function Header({t,hd,bd,mobile,isAdmin,page,go,menuOpen,setMenuOpen,adminTab,setAdminTab}) {
  const vL = [["stop","Zastávky",MapPin],["services","Služby",Compass],["passport","Pas",BookOpen],["map","Mapa",Map]];
  const aL = [["dashboard","Prehľad"],["analytics","Analytika"],["stops-table","Zastávky"],["services-table","Služby"],["villages","Obce"]];
  return (
    <div style={{ background:t.card, borderBottom:`1px solid ${t.border}`, padding:mobile?"38px 16px 10px":"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:mobile?44:56, position:"relative", zIndex:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={()=>go(isAdmin?"admin":"stop")}>
        <span style={{ fontSize:mobile?18:20 }}>⛏️</span>
        <span style={{ fontFamily:hd, fontWeight:700, fontSize:mobile?15:18, color:t.gold }}>Barborská cesta</span>
      </div>
      {!mobile && !isAdmin && <div style={{ display:"flex", gap:4 }}>{vL.map(([id,l,I])=>(
        <button key={id} onClick={()=>go(id)} style={{ background:page===id?t.accent:"transparent", border:"none", borderRadius:8, padding:"8px 16px", color:page===id?t.gold:t.text2, cursor:"pointer", fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}><I size={16}/>{l}</button>
      ))}</div>}
      {!mobile && isAdmin && <div style={{ display:"flex", gap:2 }}>{aL.map(([id,l])=>(
        <button key={id} onClick={()=>setAdminTab(id)} style={{ background:adminTab===id?t.accent:"transparent", border:"none", borderRadius:8, padding:"8px 14px", color:adminTab===id?t.gold:t.text2, cursor:"pointer", fontSize:13, fontWeight:500 }}>{l}</button>
      ))}</div>}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {!mobile && <button style={{ background:"transparent", border:`1px solid ${t.border}`, borderRadius:6, padding:"5px 10px", color:t.text3, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}><Globe size={13}/>SK / EN</button>}
        {mobile && <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"transparent", border:"none", color:t.text, cursor:"pointer" }}><Menu size={22}/></button>}
      </div>
      {mobile && menuOpen && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:t.card, borderBottom:`1px solid ${t.border}`, padding:12, zIndex:100, boxShadow:t.shadow }}>
          {(isAdmin?aL.map(([id,l])=>({id,l,fn:()=>{setAdminTab(id);setMenuOpen(false)}})):vL.map(([id,l])=>({id,l,fn:()=>go(id)}))).map(x=>(
            <button key={x.id} onClick={x.fn} style={{ display:"block", width:"100%", textAlign:"left", background:"transparent", border:"none", padding:"12px 8px", color:t.text, cursor:"pointer", fontSize:15, borderBottom:`1px solid ${t.borderL}` }}>{x.l}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ GDPR ═══
function GDPR({t,hd,bd,mobile,onAccept,onDecline}) {
  return (
    <div style={{ minHeight:mobile?700:550, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:mobile?24:48 }}>
      <div style={{ maxWidth:480, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⛏️</div>
        <h1 style={{ fontFamily:hd, fontSize:mobile?26:32, fontWeight:700, color:t.gold, margin:"0 0 8px" }}>Barborská cesta</h1>
        <p style={{ color:t.text2, fontSize:14, margin:"0 0 28px" }}>193 km · 29 zastávok · 9 etáp</p>
        <div style={{ background:t.card, borderRadius:12, padding:mobile?20:28, textAlign:"left", border:`1px solid ${t.border}`, marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}><Shield size={20} color={t.gold}/><h2 style={{ fontFamily:hd, fontSize:18, fontWeight:600, color:t.text, margin:0 }}>Ochrana vašich údajov</h2></div>
          <div style={{ fontSize:13, color:t.text2, lineHeight:1.7 }}>
            <p style={{ margin:"0 0 12px" }}><strong style={{ color:t.text }}>Čo zbierame:</strong> Zastávky, polohu pri check-ine, krajinu, vek, spôsob cestovania.</p>
            <p style={{ margin:"0 0 12px" }}><strong style={{ color:t.text }}>Prečo:</strong> Pomáhame obciam zlepšiť služby na trase.</p>
            <p style={{ margin:"0 0 12px" }}><strong style={{ color:t.text }}>Čo NEROBÍME:</strong> Nepredávame, nezdieľame, nesledujeme mimo aplikácie.</p>
            <p style={{ margin:0, padding:"10px 12px", background:t.accent, borderRadius:8, fontSize:12 }}>Ak odmietnete — aplikácia funguje rovnako. Len nebudeme ukladať štatistiku.</p>
          </div>
        </div>
        <button onClick={onAccept} style={{ width:"100%", padding:"14px", background:t.gold, color:"#1a1714", border:"none", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:10 }}>✓ Súhlasím</button>
        <button onClick={onDecline} style={{ width:"100%", padding:"14px", background:"transparent", color:t.text2, border:`1px solid ${t.border}`, borderRadius:10, fontSize:14, cursor:"pointer" }}>Pokračovať bez analytiky</button>
        <p style={{ fontSize:11, color:t.text3, marginTop:16 }}>Rozhodnutie zmeníte v nastaveniach súkromia.</p>
      </div>
    </div>
  );
}

// ═══ STOP PAGE (real map) ═══
function StopPg({t,hd,bd,mobile,stop,setStop,goMap,leaflet}) {
  const [done, setDone] = useState(stop.checkedIn||false);
  const [anim, setAnim] = useState(false);
  const next = STOPS.find(s=>s.id===stop.id+1);
  const doCheck = () => { setAnim(true); setTimeout(()=>{setDone(true);setAnim(false)},1200); };

  useEffect(() => { setDone(stop.checkedIn || false); }, [stop.id]);

  return (
    <div style={{ paddingBottom:mobile?70:20 }}>
      {/* REAL MAP */}
      <div style={{ position:"relative" }}>
        {leaflet ? (
          <LeafletMap t={t} mobile={mobile} stops={STOPS} services={SERVICES} selectedStop={stop}
            height={mobile?220:280} showAllStops={false}
            centerLat={stop.lat} centerLng={stop.lng} zoom={14}/>
        ) : (
          <div style={{ height:mobile?220:280, background:t.surface, display:"flex", alignItems:"center", justifyContent:"center", color:t.text3 }}>Načítavam mapu...</div>
        )}
        <div onClick={goMap} style={{ position:"absolute", bottom:10, right:10, background:`${t.card}ee`, borderRadius:8, padding:"6px 12px", fontSize:11, color:t.text2, border:`1px solid ${t.border}`, cursor:"pointer", zIndex:500 }}>
          <Map size={12} style={{ verticalAlign:-2, marginRight:4 }}/>Celá mapa
        </div>
      </div>

      <div style={{ padding:mobile?16:24 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", background:t.accent, borderRadius:20, fontSize:12, color:t.gold, marginBottom:10, border:`1px solid ${t.border}` }}>
          <Milestone size={12}/>Zastávka {stop.id} z 29 · Etapa {stop.stage}
        </div>
        <h1 style={{ fontFamily:hd, fontSize:mobile?26:34, fontWeight:700, color:t.text, margin:"0 0 8px" }}>{stop.name}</h1>
        <p style={{ fontSize:14, color:t.text2, lineHeight:1.7, margin:"0 0 20px" }}>{stop.desc}</p>

        {!done ? (
          <button onClick={doCheck} style={{ width:"100%", padding:"16px", background:anim?`linear-gradient(135deg,${t.gold},${t.goldL})`:t.gold, color:"#1a1714", border:"none", borderRadius:12, fontSize:17, fontWeight:700, cursor:"pointer", fontFamily:hd, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transform:anim?"scale(0.97)":"scale(1)", transition:"all .2s" }}>
            {anim?"✦ Overujem polohu...":<><Stamp size={20}/>Zaznamenať návštevu</>}
          </button>
        ) : (
          <div style={{ width:"100%", padding:"14px", background:t.greenBg, border:`2px solid ${t.green}`, borderRadius:12, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:t.green, fontWeight:600, fontSize:15, fontFamily:hd }}><CircleCheck size={20}/>GPS overené ✓</div>
        )}

        <h3 style={{ fontFamily:hd, fontSize:16, fontWeight:600, color:t.text, margin:"0 0 12px" }}>Zaujímavosti</h3>
        <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8, marginBottom:24 }}>
          {[["🏛️","Historická mincovňa","Kremnická mincovňa funguje od roku 1328 — najstaršia nepretržite fungujúca na svete."],["⛪","Kostol sv. Kataríny","Gotický kostol je jednou z najcennejších stredovekých pamiatok Slovenska."],["🏔️","Kremnické vrchy","Sopečné pohorie s Flochovou (1 318 m n. m.)."]].map(([ic,ti,tx],i)=>(
            <div key={i} style={{ minWidth:mobile?260:220, background:t.card, borderRadius:10, padding:16, border:`1px solid ${t.border}`, flexShrink:0 }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{ic}</div>
              <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:6 }}>{ti}</div>
              <div style={{ fontSize:13, color:t.text2, lineHeight:1.6 }}>{tx}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily:hd, fontSize:16, fontWeight:600, color:t.text, margin:"0 0 12px" }}>Zariadenia</h3>
        <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(3,1fr)":"repeat(5,1fr)", gap:8, marginBottom:24 }}>
          {Object.entries(FACS).map(([k,ic])=>{const ok=stop.fac?.includes(k);return(
            <div key={k} style={{ textAlign:"center", padding:"10px 4px", borderRadius:8, background:ok?t.greenBg:t.surface, border:`1px solid ${ok?t.green+"40":t.borderL}`, opacity:ok?1:0.4 }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
              <div style={{ fontSize:10, color:ok?t.green:t.text3, fontWeight:500 }}>{FAC_N[k]}</div>
              {ok && <div style={{ fontSize:10, color:t.green, marginTop:2 }}>{(Math.random()*400+50|0)} m</div>}
            </div>
          )})}
        </div>

        {next && (
          <div style={{ background:t.card, borderRadius:12, padding:16, border:`1px solid ${t.border}`, marginBottom:16, cursor:"pointer" }} onClick={()=>{setStop(next);}}>
            <div style={{ fontSize:11, color:t.text3, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Ďalšia zastávka</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontFamily:hd, fontSize:18, fontWeight:600, color:t.text, marginBottom:4 }}>{next.name}</div>
                <div style={{ fontSize:13, color:t.text2, display:"flex", gap:12 }}><span>📍 {(Math.random()*8+3).toFixed(1)} km</span><span>🚶 ~{(Math.random()*120+40|0)} min</span></div></div>
              <ChevronRight size={24} color={t.gold}/>
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[[Map,"Celá mapa",goMap],[Navigation,"Google Maps"],[Share2,"Zdieľať"]].map(([I,l,fn],i)=>(
            <button key={i} onClick={fn} style={{ flex:1, minWidth:100, padding:"10px", background:t.card, border:`1px solid ${t.border}`, borderRadius:8, color:t.text2, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><I size={14}/>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ MAP FULL PAGE ═══
function MapFull({t,hd,bd,mobile,leaflet,onSelect}) {
  const [filter, setFilter] = useState([]);
  const filteredSvc = filter.length === 0 ? SERVICES : SERVICES.filter(s => filter.includes(s.cat));
  return (
    <div style={{ position:"relative", height:mobile?"calc(100vh - 200px)":"calc(100vh - 160px)", minHeight:500 }}>
      {leaflet ? (
        <LeafletMap t={t} mobile={mobile} stops={STOPS} services={filteredSvc} selectedStop={null}
          onSelectStop={onSelect} height="100%" showAllStops={true} zoom={10} centerLat={48.63} centerLng={19.00}/>
      ) : (
        <div style={{ height:"100%", background:t.surface, display:"flex", alignItems:"center", justifyContent:"center", color:t.text3 }}>Načítavam mapu...</div>
      )}
      <div style={{ position:"absolute", bottom:mobile?68:16, left:mobile?8:16, display:"flex", gap:6, flexWrap:"wrap", zIndex:500 }}>
        {["bed","food","water","bike","shelter","medical"].map(c=>{const I=CAT_I[c];const a=filter.includes(c);return(
          <button key={c} onClick={()=>setFilter(p=>a?p.filter(x=>x!==c):[...p,c])} style={{ background:a?`${t.card}`:`${t.card}cc`, borderRadius:20, padding:"6px 12px", border:`1.5px solid ${a?CAT_CLR[c]:t.border}`, color:a?CAT_CLR[c]:t.text2, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontWeight:a?600:400, boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}><I size={13}/>{CAT_N[c]}</button>
        )})}
      </div>
    </div>
  );
}

// ═══ SERVICES PAGE ═══
function SvcPg({t,hd,bd,mobile,filter,setFilter,onSelect}) {
  const cats=["bed","food","water","bike","shelter","medical"];
  const list=filter.length===0?SERVICES:SERVICES.filter(s=>filter.includes(s.cat));
  return (
    <div style={{ padding:mobile?16:24, paddingBottom:mobile?80:24 }}>
      <h1 style={{ fontFamily:hd, fontSize:mobile?24:30, fontWeight:700, color:t.text, margin:"0 0 4px" }}>Služby na trase</h1>
      <p style={{ fontSize:14, color:t.text2, margin:"0 0 20px" }}>Nájdite ubytovanie, jedlo, vodu a servis</p>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cats.map(c=>{const I=CAT_I[c];const a=filter.includes(c);return(
          <button key={c} onClick={()=>setFilter(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c])} style={{ padding:"8px 14px", borderRadius:20, fontSize:13, background:a?t.gold+"20":t.card, border:`1px solid ${a?t.gold:t.border}`, color:a?t.gold:t.text2, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontWeight:a?600:400 }}><I size={14}/>{CAT_N[c]}</button>
        )})}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {list.map(s=>{const I=CAT_I[s.cat]||Compass;return(
          <div key={s.id} onClick={()=>onSelect(s)} style={{ background:t.card, borderRadius:12, padding:16, border:`1px solid ${t.border}`, cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${t.border}` }}><I size={16} color={t.gold}/></div>
                  <div><div style={{ fontFamily:hd, fontWeight:600, fontSize:15, color:t.text }}>{s.name}</div><div style={{ fontSize:12, color:t.text3 }}>{CAT_N[s.cat]}</div></div>
                </div>
                <div style={{ fontSize:13, color:t.text2, display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
                  <span>📍 {s.stop}</span><span>↗ {s.dist}</span>{s.pilgrim&&<span style={{ color:t.gold, fontWeight:500 }}>⛏ Pútnik-friendly</span>}
                </div>
              </div>
              <ChevronRight size={20} color={t.text3} style={{ marginTop:8 }}/>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

// ═══ SERVICE DETAIL (real mini-map) ═══
function SvcDet({t,hd,bd,mobile,svc,onBack,leaflet}) {
  const I=CAT_I[svc.cat]||Compass;
  return (
    <div style={{ padding:mobile?16:24, paddingBottom:mobile?80:24 }}>
      <button onClick={onBack} style={{ background:"transparent", border:"none", color:t.gold, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:4, padding:0, marginBottom:16 }}><ChevronLeft size={18}/>Späť</button>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${t.border}` }}><I size={24} color={t.gold}/></div>
        <div><h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:0 }}>{svc.name}</h1>{svc.pilgrim&&<span style={{ fontSize:12, color:t.gold, fontWeight:600 }}>⛏ Certifikované pre pútnikov</span>}</div>
      </div>
      <p style={{ fontSize:14, color:t.text2, lineHeight:1.7, marginBottom:20 }}>{svc.desc}</p>
      <div style={{ background:t.card, borderRadius:12, padding:16, border:`1px solid ${t.border}`, marginBottom:16 }}>
        {[[MapPin,"Zastávka",svc.stop],[Navigation,"Vzdialenosť",svc.dist],[Clock,"Hodiny",svc.hours],...(svc.phone?[[Phone,"Telefón",svc.phone]]:[])].map(([Ic,lab,val],i,a)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<a.length-1?`1px solid ${t.borderL}`:"none" }}><Ic size={16} color={t.text3}/><div><div style={{ fontSize:11, color:t.text3 }}>{lab}</div><div style={{ fontSize:14, color:t.text, fontWeight:500 }}>{val}</div></div></div>
        ))}
      </div>
      {/* REAL MINI MAP */}
      <div style={{ borderRadius:12, overflow:"hidden", marginBottom:16, border:`1px solid ${t.border}` }}>
        {leaflet && svc.lat ? (
          <LeafletMap t={t} mobile={mobile} stops={STOPS.filter(s=>s.id===svc.stopId)} services={[svc]}
            selectedStop={null} height={180} showAllStops={true} showServices={true}
            centerLat={svc.lat} centerLng={svc.lng} zoom={15}/>
        ) : (
          <div style={{ height:180, background:t.surface, display:"flex", alignItems:"center", justifyContent:"center", color:t.text3 }}>Mapa</div>
        )}
      </div>
      <button style={{ width:"100%", padding:"14px", background:t.gold, color:"#1a1714", border:"none", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Navigation size={16}/>Navigovať cez Google Maps</button>
    </div>
  );
}

// ═══ PASSPORT ═══
function Passport({t,hd,bd,mobile}) {
  const visited=STOPS.filter(s=>s.checkedIn).length;const validated=STOPS.filter(s=>s.validated).length;
  return (
    <div style={{ padding:mobile?16:24, paddingBottom:mobile?80:24 }}>
      <h1 style={{ fontFamily:hd, fontSize:mobile?24:30, fontWeight:700, color:t.text, margin:"0 0 16px" }}>Pútnický pas</h1>
      <div style={{ background:t.card, borderRadius:12, padding:16, border:`1px solid ${t.border}`, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}><span style={{ color:t.text2 }}>Navštívené</span><span style={{ color:t.gold, fontWeight:600 }}>{visited}/29</span></div>
        <div style={{ height:8, background:t.surface, borderRadius:4, overflow:"hidden", marginBottom:12 }}><div style={{ width:`${(visited/29)*100}%`, height:"100%", background:t.gold, borderRadius:4 }}/></div>
        <div style={{ display:"flex", gap:16, fontSize:13, flexWrap:"wrap" }}><span style={{ color:t.green }}>✓ {validated} overených</span><span style={{ color:t.amber }}>○ {visited-validated} neoverených</span><span style={{ color:t.text3 }}>18 pre certifikát</span></div>
      </div>
      {[1,2,3,4,5,6,7,8,9].map(st=>{const ss=STOPS.filter(s=>s.stage===st);return(
        <div key={st} style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"6px 0", borderBottom:`1px solid ${t.borderL}` }}>
            <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:24, height:24, borderRadius:"50%", background:t.gold+"20", fontSize:12, fontWeight:700, color:t.gold }}>{st}</span>
            <span style={{ fontSize:13, fontWeight:600, color:t.text }}>Etapa {st}</span>
            <span style={{ fontSize:11, color:t.text3 }}>{STAGES_N[st-1]}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(3,1fr)":"repeat(6,1fr)", gap:8 }}>
            {ss.map(s=>{const state=s.validated?"v":s.checkedIn?(s.validated===false?"p":"c"):"e";const c={v:{bg:t.gold+"18",b:t.gold,c:t.gold},p:{bg:t.amberBg,b:t.amber,c:t.amber},c:{bg:t.accent,b:t.border,c:t.text2},e:{bg:t.surface,b:t.borderL,c:t.text3}}[state];return(
              <div key={s.id} style={{ textAlign:"center", padding:"12px 6px", borderRadius:10, background:c.bg, border:`1.5px solid ${c.b}`, cursor:"pointer" }}>
                <div style={{ fontSize:28, lineHeight:1, marginBottom:4 }}>{state==="v"?"🏅":state==="p"?"🟡":state==="c"?"👁️":"○"}</div>
                <div style={{ fontSize:10, fontWeight:600, color:c.c, lineHeight:1.3 }}>{s.name.length>14?s.name.slice(0,12)+"…":s.name}</div>
                <div style={{ fontSize:9, color:t.text3, marginTop:2 }}>#{s.id}</div>
              </div>
            )})}
          </div>
        </div>
      )})}
      <div style={{ background:t.card, borderRadius:12, padding:20, marginTop:12, border:`1px solid ${t.gold}40`, textAlign:"center" }}>
        <Lock size={20} color={t.gold} style={{ marginBottom:8 }}/><div style={{ fontFamily:hd, fontSize:16, fontWeight:600, color:t.text, marginBottom:6 }}>Uložte svoj postup</div>
        <div style={{ fontSize:13, color:t.text2, marginBottom:14 }}>Vytvorte si účet a váš pas bude dostupný na všetkých zariadeniach.</div>
        <button style={{ padding:"10px 24px", background:t.gold, color:"#1a1714", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>Uložiť postup</button>
      </div>
    </div>
  );
}

// ═══ ADMIN PANEL ═══
function Admin({t,hd,bd,mobile,tab,setTab}) {
  return (
    <div style={{ padding:mobile?16:24, paddingBottom:mobile?80:24 }}>
      {mobile && <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16 }}>
        {[["dashboard","Prehľad"],["analytics","Analytika"],["stops-table","Zastávky"],["services-table","Služby"],["villages","Obce"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ padding:"6px 12px", borderRadius:20, fontSize:12, whiteSpace:"nowrap", background:tab===id?t.gold+"20":t.card, border:`1px solid ${tab===id?t.gold:t.border}`, color:tab===id?t.gold:t.text2, cursor:"pointer" }}>{l}</button>
        ))}</div>}
      {tab==="dashboard"&&<Dash t={t} hd={hd} mobile={mobile}/>}
      {tab==="analytics"&&<Anal t={t} hd={hd} mobile={mobile}/>}
      {tab==="stops-table"&&<STbl t={t} hd={hd} mobile={mobile}/>}
      {tab==="services-table"&&<SVTbl t={t} hd={hd} mobile={mobile}/>}
      {tab==="villages"&&<Vill t={t} hd={hd} mobile={mobile}/>}
    </div>
  );
}

function CCard({t,hd,title,sub,children}) {
  return (<div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}><div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.borderL}` }}><div style={{ fontFamily:hd, fontWeight:600, fontSize:14, color:t.text }}>{title}</div>{sub&&<div style={{ fontSize:11, color:t.text3, marginTop:2 }}>{sub}</div>}</div><div style={{ padding:"8px 12px" }}>{children}</div></div>);
}

function Dash({t,hd,mobile}) {
  const kpis=[{l:"QR skeny",v:"18 432",c:"+12%",u:1},{l:"Check-iny",v:"6 847",c:"+8%",u:1},{l:"Unikátni",v:"892",c:"+23%",u:1},{l:"Ø zastávok",v:"4.2",c:"-0.3",u:0},{l:"Dokončenie",v:"3.1%",c:"+0.4%",u:1},{l:"TOP dnes",v:"Kremnica",c:"324×",u:1}];
  return (<div>
    <h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:"0 0 20px" }}>Prehľad trasy</h1>
    <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:mobile?8:12, marginBottom:24 }}>
      {kpis.map((k,i)=>(<div key={i} style={{ background:t.card, borderRadius:10, padding:mobile?12:16, border:`1px solid ${t.border}` }}>
        <div style={{ fontSize:11, color:t.text3, marginBottom:6 }}>{k.l}</div>
        <div style={{ fontFamily:hd, fontSize:mobile?20:26, fontWeight:700, color:t.text, marginBottom:4 }}>{k.v}</div>
        <div style={{ fontSize:12, fontWeight:500, color:k.u?t.green:t.red, display:"flex", alignItems:"center", gap:4 }}>{k.u?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>}{k.c}</div>
      </div>))}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:16, marginBottom:24 }}>
      <CCard t={t} hd={hd} title="Trend návštevnosti" sub="30 dní">
        <svg viewBox="0 0 400 180" style={{ width:"100%", height:180 }}>
          <defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.gold} stopOpacity="0.3"/><stop offset="100%" stopColor={t.gold} stopOpacity="0"/></linearGradient></defs>
          {[40,80,120,160].map(y=><line key={y} x1="40" y1={y} x2="380" y2={y} stroke={t.border} strokeWidth="0.5"/>)}
          <path d="M 40 140 L 80 120 L 120 130 L 160 100 L 200 90 L 240 70 L 280 85 L 320 60 L 360 50 L 380 55 L 380 160 L 40 160 Z" fill="url(#lg1)"/>
          <path d="M 40 140 L 80 120 L 120 130 L 160 100 L 200 90 L 240 70 L 280 85 L 320 60 L 360 50 L 380 55" fill="none" stroke={t.gold} strokeWidth="2.5" strokeLinecap="round"/>
          {[[40,140],[80,120],[120,130],[160,100],[200,90],[240,70],[280,85],[320,60],[360,50],[380,55]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={t.gold} stroke={t.card} strokeWidth="2"/>)}
        </svg>
      </CCard>
      <CCard t={t} hd={hd} title="Check-iny podľa etáp">
        <svg viewBox="0 0 400 180" style={{ width:"100%", height:180 }}>
          {[1,2,3,4,5,6,7,8,9].map((s,i)=>{const h=[140,125,100,85,75,60,55,45,35][i];const x=50+i*38;return(<g key={s}><rect x={x} y={160-h} width="28" height={h} rx="4" fill={t.gold} opacity={0.3+i*0.07}/><text x={x+14} y={175} textAnchor="middle" fontSize="9" fill={t.text3}>E{s}</text></g>)})}
        </svg>
      </CCard>
      <CCard t={t} hd={hd} title="Krajiny" sub="90 dní">
        <div style={{ display:"flex", alignItems:"center", gap:16, padding:"10px 0" }}>
          <svg viewBox="0 0 120 120" style={{ width:110, height:110, flexShrink:0 }}>
            <circle cx="60" cy="60" r="48" fill="none" stroke={t.surface} strokeWidth="18"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke={t.gold} strokeWidth="18" strokeDasharray="136 166" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke={t.goldL} strokeWidth="18" strokeDasharray="75 227" strokeDashoffset="-136" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke={t.green} strokeWidth="18" strokeDasharray="36 266" strokeDashoffset="-211" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke={t.amber} strokeWidth="18" strokeDasharray="24 278" strokeDashoffset="-247" transform="rotate(-90 60 60)"/>
          </svg>
          <div style={{ fontSize:12, lineHeight:2.2 }}>
            {[[t.gold,"SK 45%"],[t.goldL,"CZ 25%"],[t.green,"DE 12%"],[t.amber,"Ost. 18%"]].map(([c,l],i)=><div key={i}><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:c, marginRight:6, verticalAlign:-1 }}/><span style={{ color:t.text }}>{l}</span></div>)}
          </div>
        </div>
      </CCard>
      <CCard t={t} hd={hd} title="Spôsob cestovania">
        <div style={{ padding:"16px 0" }}>{[["Pešo",72,t.gold],["Bicykel",24,t.green],["Iné",4,t.text3]].map(([l,p,c],i)=>(<div key={i} style={{ marginBottom:12 }}><div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span style={{ color:t.text }}>{l}</span><span style={{ color:c, fontWeight:600 }}>{p}%</span></div><div style={{ height:8, background:t.surface, borderRadius:4 }}><div style={{ width:`${p}%`, height:"100%", background:c, borderRadius:4, opacity:0.8 }}/></div></div>))}</div>
      </CCard>
    </div>
    <div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between" }}><span style={{ fontFamily:hd, fontWeight:600, fontSize:15, color:t.text }}>Aktivita</span><span style={{ fontSize:11, color:t.text3 }}><RefreshCw size={11} style={{ verticalAlign:-2 }}/> 30s</span></div>
      {[["🌍","Návštevník z Nemecka","14:32"],["✅","Check-in Kremnica (GPS)","14:28"],["👁️","B. Štiavnica 12×","14:15"],["📍","Check-in Špania Dolina","13:55"],["🌍","Nový z Česka","13:42"]].map(([ic,tx,tm],i)=>(
        <div key={i} style={{ padding:"10px 16px", borderBottom:`1px solid ${t.borderL}`, display:"flex", alignItems:"center", gap:10, fontSize:13 }}><span style={{ fontSize:16 }}>{ic}</span><span style={{ color:t.text, flex:1 }}>{tx}</span><span style={{ color:t.text3, fontSize:11 }}>Dnes {tm}</span></div>
      ))}
    </div>
  </div>);
}

function Anal({t,hd,mobile}) {
  const f=[{s:1,v:892,p:100},{s:2,v:758,p:85},{s:3,v:621,p:70},{s:4,v:498,p:56},{s:5,v:410,p:46},{s:6,v:312,p:35},{s:7,v:245,p:27},{s:8,v:178,p:20},{s:9,v:128,p:14}];
  return (<div>
    <h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:"0 0 20px" }}>Analytika</h1>
    <div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, padding:mobile?16:24, marginBottom:24 }}>
      <h3 style={{ fontFamily:hd, fontSize:16, fontWeight:600, color:t.text, margin:"0 0 4px" }}>Lievik poklesu</h3>
      <p style={{ fontSize:12, color:t.text3, margin:"0 0 20px" }}>Kde trasa stráca návštevníkov</p>
      {f.map((item,i)=>{const drop=i>0?f[i-1].v-item.v:0;const dp=i>0?Math.round(drop/f[i-1].v*100):0;return(
        <div key={item.s}>{i>0&&drop>0&&<div style={{ textAlign:"center", padding:"4px 0", fontSize:11, color:dp>20?t.red:t.amber }}>↓ −{drop} ({dp}%)</div>}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <div style={{ width:50, textAlign:"right", fontSize:12, color:t.text3 }}>Etapa {item.s}</div>
            <div style={{ flex:1, height:28, background:t.surface, borderRadius:6, overflow:"hidden" }}><div style={{ width:`${item.p}%`, height:"100%", borderRadius:6, background:`linear-gradient(90deg,${t.gold}cc,${t.gold}44)`, display:"flex", alignItems:"center", paddingLeft:10 }}><span style={{ fontSize:11, fontWeight:600, color:"#1a1714" }}>{item.v}</span></div></div>
            <div style={{ width:36, textAlign:"right", fontSize:12, fontWeight:600, color:t.gold }}>{item.p}%</div>
          </div></div>
      )})}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)", gap:10 }}>
      {f.map(item=>(<div key={item.s} style={{ background:t.card, borderRadius:10, padding:14, border:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontFamily:hd, fontWeight:600, color:t.text }}>Etapa {item.s}</span><span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:item.p>50?t.greenBg:item.p>25?t.amberBg:t.redBg, color:item.p>50?t.green:item.p>25?t.amber:t.red }}>{item.p}%</span></div>
        <div style={{ fontSize:22, fontWeight:700, color:t.gold, fontFamily:hd }}>{item.v}</div>
      </div>))}
    </div>
  </div>);
}

function STbl({t,hd,mobile}) {
  const [q,setQ]=useState("");const list=STOPS.filter(s=>s.name.toLowerCase().includes(q.toLowerCase()));
  return (<div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
      <h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:0 }}>Zastávky</h1>
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:t.card, border:`1px solid ${t.border}`, borderRadius:8 }}><Search size={14} color={t.text3}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Hľadať..." style={{ background:"transparent", border:"none", outline:"none", color:t.text, fontSize:13, width:120 }}/></div>
    </div>
    <div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"2fr 1fr 1fr":"2.5fr .7fr 1fr 1fr 1fr", padding:"10px 16px", borderBottom:`1px solid ${t.border}`, fontSize:11, color:t.text3, fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}><span>Názov</span><span>Etapa</span>{!mobile&&<span>Zobrazenia</span>}<span>Check-iny</span>{!mobile&&<span>Overené</span>}</div>
      {list.slice(0,15).map(s=>{const vw=100+s.id*30;const ci=Math.floor(vw*.35);const va=Math.floor(ci*.68);return(
        <div key={s.id} style={{ display:"grid", gridTemplateColumns:mobile?"2fr 1fr 1fr":"2.5fr .7fr 1fr 1fr 1fr", padding:"10px 16px", borderBottom:`1px solid ${t.borderL}`, fontSize:13, alignItems:"center" }}>
          <span style={{ fontWeight:500, color:t.text }}>{s.name}</span><span style={{ color:t.text3 }}>{s.stage}</span>{!mobile&&<span style={{ color:t.text2 }}>{vw}</span>}<span style={{ color:t.gold, fontWeight:500 }}>{ci}</span>{!mobile&&<span style={{ color:t.green }}>{va}</span>}
        </div>
      )})}
    </div>
  </div>);
}

function SVTbl({t,hd,mobile}) {
  return (<div>
    <h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:"0 0 16px" }}>Služby</h1>
    <div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"2fr 1fr 1fr":"2fr 1fr 1.2fr .8fr", padding:"10px 16px", borderBottom:`1px solid ${t.border}`, fontSize:11, color:t.text3, fontWeight:600, textTransform:"uppercase" }}><span>Názov</span><span>Kategória</span>{!mobile&&<span>Zastávka</span>}<span>Zobr.</span></div>
      {SERVICES.map(s=>{const vw=20+s.id*18;return(
        <div key={s.id} style={{ display:"grid", gridTemplateColumns:mobile?"2fr 1fr 1fr":"2fr 1fr 1.2fr .8fr", padding:"10px 16px", borderBottom:`1px solid ${t.borderL}`, fontSize:13, alignItems:"center" }}>
          <div><span style={{ fontWeight:500, color:t.text }}>{s.name}</span>{s.pilgrim&&<span style={{ fontSize:10, color:t.gold, marginLeft:6 }}>⛏</span>}</div>
          <span style={{ color:t.text2, fontSize:12 }}>{CAT_N[s.cat]}</span>{!mobile&&<span style={{ color:t.text3 }}>{s.stop}</span>}<span style={{ color:t.gold }}>{vw}</span>
        </div>
      )})}
    </div>
  </div>);
}

function Vill({t,hd,mobile}) {
  const [sel,setSel]=useState("Kremnica");const vs=["Banská Bystrica","Staré Hory","Špania Dolina","Kremnica","Sklené Teplice","Banská Štiavnica","Zvolen","Sliač"];
  return (<div>
    <h1 style={{ fontFamily:hd, fontSize:mobile?22:28, fontWeight:700, color:t.text, margin:"0 0 16px" }}>Správy obcí</h1>
    <div style={{ display:mobile?"block":"flex", gap:20 }}>
      <div style={{ width:mobile?"100%":200, flexShrink:0, marginBottom:mobile?16:0 }}>
        {mobile?<div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8 }}>{vs.map(v=><button key={v} onClick={()=>setSel(v)} style={{ padding:"6px 12px", borderRadius:20, fontSize:12, whiteSpace:"nowrap", background:sel===v?t.gold+"20":t.card, border:`1px solid ${sel===v?t.gold:t.border}`, color:sel===v?t.gold:t.text2, cursor:"pointer" }}>{v}</button>)}</div>
        :<div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>{vs.map(v=><button key={v} onClick={()=>setSel(v)} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 14px", border:"none", background:sel===v?t.accent:"transparent", color:sel===v?t.gold:t.text2, cursor:"pointer", fontSize:13, fontWeight:sel===v?600:400, borderBottom:`1px solid ${t.borderL}` }}>{v}</button>)}</div>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ background:t.card, borderRadius:12, border:`1px solid ${t.border}`, padding:mobile?16:24 }}>
          <h2 style={{ fontFamily:hd, fontSize:22, fontWeight:700, color:t.text, margin:"0 0 4px" }}>{sel}</h2>
          <p style={{ fontSize:12, color:t.text3, margin:"0 0 20px" }}>3 zastávky · 30 dní</p>
          <div style={{ background:t.accent, borderRadius:10, padding:16, marginBottom:20, border:`1px solid ${t.border}`, textAlign:"center" }}>
            <div style={{ fontSize:36, fontWeight:700, color:t.gold, fontFamily:hd }}>340</div>
            <div style={{ fontSize:13, color:t.text2 }}>návštevníkov / mesiac</div>
          </div>
          <h3 style={{ fontFamily:hd, fontSize:15, fontWeight:600, color:t.text, margin:"0 0 12px" }}>Dopyt vs. ponuka</h3>
          {[["Ubytovanie",78,23,t.red],["Jedlo",65,45,t.amber],["Voda",40,85,t.green]].map(([l,s,f,c],i)=>(<div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span style={{ color:t.text }}>{l}</span><span style={{ color:c, fontSize:12 }}>{s}% hľadalo · {f}% našlo</span></div>
            <div style={{ display:"flex", gap:4, height:10 }}><div style={{ width:`${s}%`, height:"100%", background:c, borderRadius:4, opacity:0.3 }}/><div style={{ width:`${f}%`, height:"100%", background:c, borderRadius:4 }}/></div>
          </div>))}
          <div style={{ background:t.redBg, borderRadius:10, padding:14, marginTop:16, border:`1px solid ${t.red}30` }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.red, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}><AlertTriangle size={14}/>Insight</div>
            <div style={{ fontSize:13, color:t.text2, lineHeight:1.6 }}>78% hľadalo ubytovanie, len 23% našlo. Obec stráca hostí a príjmy.</div>
          </div>
          <button style={{ marginTop:16, padding:"10px 20px", background:t.surface, border:`1px solid ${t.border}`, borderRadius:8, color:t.text2, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6 }}><Download size={14}/>Export PDF</button>
        </div>
      </div>
    </div>
  </div>);
}
