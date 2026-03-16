// Sample GeoJSON data for Ocaña, Norte de Santander, Colombia
// Center coordinates: approximately 8.2376° N, 73.3575° W

export const OCANA_CENTER: [number, number] = [8.2376, -73.3575];
export const OCANA_ZOOM = 14;

export interface LayerConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  visible: boolean;
  opacity: number;
  description: string;
}

export const LAYER_CATEGORIES = [
  { id: "ambiente", name: "Ambiente y Desarrollo Sostenible", icon: "Leaf" },
  { id: "agricultura", name: "Agricultura y Desarrollo Rural", icon: "Wheat" },
  { id: "ordenamiento", name: "Ordenamiento Territorial", icon: "Map" },
  { id: "vivienda", name: "Vivienda, Ciudad y Territorio", icon: "Home" },
  { id: "deporte", name: "Deporte y Recreación", icon: "Trophy" },
  { id: "servicios", name: "Servicios Públicos", icon: "Zap" },
  { id: "industria", name: "Industria y Comercio", icon: "Factory" },
  { id: "turismo", name: "Turismo", icon: "Compass" },
  { id: "cultura", name: "Cultura", icon: "Palette" },
  { id: "educacion_cat", name: "Educación", icon: "GraduationCap" },
  { id: "salud_cat", name: "Salud y Protección Social", icon: "Heart" },
  { id: "movilidad", name: "Movilidad y Transporte", icon: "Car" },
  { id: "ciencia", name: "Ciencia, Tecnología e Innovación", icon: "Cpu" },
  { id: "seguridad", name: "Seguridad y Defensa", icon: "Shield" },
  { id: "funcion_publica", name: "Función Pública", icon: "Landmark" },
];

export const LAYERS_CONFIG: LayerConfig[] = [
  // ── AMBIENTE Y DESARROLLO SOSTENIBLE ──
  { id: "arbolado_urbano", name: "Arbolado Urbano", icon: "TreePine", color: "#27AE60", category: "ambiente", visible: false, opacity: 0.7, description: "Inventario de arbolado en zonas urbanas" },
  { id: "recurso_hidrico", name: "Recurso hídrico", icon: "Waves", color: "#3498DB", category: "ambiente", visible: false, opacity: 0.7, description: "Cuerpos de agua, ríos y quebradas" },
  { id: "residuos_solidos", name: "Gestión de Residuos Sólidos", icon: "Trash2", color: "#95A5A6", category: "ambiente", visible: false, opacity: 0.7, description: "Puntos y rutas de gestión de residuos" },
  { id: "areas_protegidas", name: "Áreas protegidas", icon: "Shield", color: "#1ABC9C", category: "ambiente", visible: false, opacity: 0.7, description: "Áreas con protección ambiental especial" },
  { id: "reserva_forestal", name: "Áreas de protección de reserva forestal", icon: "TreePine", color: "#16A085", category: "ambiente", visible: false, opacity: 0.7, description: "Zonas de reserva forestal protegida" },
  { id: "reserva_hidrica", name: "Áreas de reserva del recurso hídrico", icon: "Droplets", color: "#2980B9", category: "ambiente", visible: false, opacity: 0.7, description: "Zonas de protección hídrica" },
  { id: "recuperacion_ambiental", name: "Áreas de recuperación ambiental", icon: "Sprout", color: "#2ECC71", category: "ambiente", visible: false, opacity: 0.7, description: "Zonas en proceso de restauración" },
  { id: "areas_erosionadas", name: "Áreas erosionadas", icon: "Mountain", color: "#D35400", category: "ambiente", visible: false, opacity: 0.7, description: "Zonas con procesos de erosión" },
  { id: "sistema_orografico", name: "Sistema orográfico", icon: "Mountain", color: "#8D6E63", category: "ambiente", visible: false, opacity: 0.7, description: "Relieve y formaciones montañosas" },
  { id: "mapa_ruido", name: "Mapa Estratégico de Ruido", icon: "Volume2", color: "#E74C3C", category: "ambiente", visible: false, opacity: 0.7, description: "Niveles de ruido por zonas" },
  { id: "calidad_aire", name: "Estaciones de Calidad del Aire", icon: "Wind", color: "#5DADE2", category: "ambiente", visible: false, opacity: 0.7, description: "Estaciones de monitoreo atmosférico" },

  // ── AGRICULTURA Y DESARROLLO RURAL ──
  { id: "areas_cultivadas", name: "Áreas cultivadas", icon: "Wheat", color: "#F4D03F", category: "agricultura", visible: false, opacity: 0.7, description: "Zonas con cultivos activos" },
  { id: "distritos_riego", name: "Distritos de riego", icon: "Droplets", color: "#2E86C1", category: "agricultura", visible: false, opacity: 0.7, description: "Distritos y sistemas de riego" },
  { id: "aptitud_agricola", name: "Zonas de Aptitud Agrícola", icon: "Leaf", color: "#82E0AA", category: "agricultura", visible: false, opacity: 0.7, description: "Clasificación de aptitud del suelo" },

  // ── ORDENAMIENTO TERRITORIAL ──
  { id: "uso_suelo", name: "Usos del suelo", icon: "TreePine", color: "#27AE60", category: "ordenamiento", visible: false, opacity: 0.3, description: "Clasificación del uso del suelo" },
  { id: "cartografia_basica", name: "Cartografía básica", icon: "Map", color: "#7F8C8D", category: "ordenamiento", visible: false, opacity: 0.7, description: "Cartografía de referencia" },
  { id: "curvas_nivel", name: "Curvas de nivel", icon: "Mountain", color: "#A0522D", category: "ordenamiento", visible: false, opacity: 0.7, description: "Curvas de nivel topográficas" },
  { id: "comunas", name: "Comunas", icon: "Layout", color: "#4A90D9", category: "ordenamiento", visible: false, opacity: 0.4, description: "División por comunas del municipio" },
  { id: "areas_inundables", name: "Áreas inundables en zona urbana", icon: "Waves", color: "#1F618D", category: "ordenamiento", visible: false, opacity: 0.7, description: "Zonas con riesgo de inundación" },
  { id: "amenaza_masa", name: "Zonas de amenaza por movimientos en masa", icon: "AlertTriangle", color: "#E74C3C", category: "ordenamiento", visible: false, opacity: 0.7, description: "Zonas con riesgo de deslizamiento" },
  { id: "base_catastral", name: "Base de datos catastral", icon: "Database", color: "#8E44AD", category: "ordenamiento", visible: false, opacity: 0.7, description: "Información catastral del municipio" },

  // ── VIVIENDA, CIUDAD Y TERRITORIO ──
  { id: "ocupacion_ilegal", name: "Ocupación ilegal", icon: "AlertTriangle", color: "#C0392B", category: "vivienda", visible: false, opacity: 0.7, description: "Zonas con ocupación irregular" },
  { id: "vivienda_subsidiada", name: "Proyecto de Vivienda Subsidiada", icon: "Home", color: "#2ECC71", category: "vivienda", visible: false, opacity: 0.7, description: "Proyectos de vivienda con subsidio" },
  { id: "espacio_publico_verde", name: "Indicador de Espacio Público Verde", icon: "TreePine", color: "#27AE60", category: "vivienda", visible: false, opacity: 0.7, description: "Metros cuadrados de espacio verde" },
  { id: "espacio_publico", name: "Indicador de Espacio Público", icon: "Square", color: "#3498DB", category: "vivienda", visible: false, opacity: 0.7, description: "Indicadores de espacio público" },
  { id: "viviendas_riesgo", name: "Viviendas en condición de riesgo", icon: "AlertTriangle", color: "#E74C3C", category: "vivienda", visible: false, opacity: 0.7, description: "Viviendas con riesgo estructural" },
  { id: "zonas_uso_mixto", name: "Zonas industriales, comerciales y residenciales", icon: "Building2", color: "#F39C12", category: "vivienda", visible: false, opacity: 0.7, description: "Clasificación de zonas mixtas" },
  { id: "parques_zonas_verdes", name: "Parques y zonas verdes", icon: "TreePine", color: "#1ABC9C", category: "vivienda", visible: false, opacity: 0.7, description: "Parques y áreas verdes urbanas" },
  { id: "densidad_poblacional", name: "Densidad poblacional", icon: "Users", color: "#9B59B6", category: "vivienda", visible: false, opacity: 0.7, description: "Densidad de habitantes por zona" },

  // ── DEPORTE Y RECREACIÓN ──
  { id: "canchas_futbol", name: "Canchas de fútbol / microfútbol", icon: "Trophy", color: "#27AE60", category: "deporte", visible: false, opacity: 0.7, description: "Canchas de fútbol y microfútbol" },
  { id: "centros_recreacion", name: "Centros de recreación", icon: "Smile", color: "#F1C40F", category: "deporte", visible: false, opacity: 0.7, description: "Centros recreativos y de ocio" },
  { id: "coliseos", name: "Coliseos deportivos", icon: "Building2", color: "#E67E22", category: "deporte", visible: false, opacity: 0.7, description: "Coliseos y polideportivos cubiertos" },
  { id: "pistas_deportivas", name: "Pistas deportivas", icon: "Trophy", color: "#3498DB", category: "deporte", visible: false, opacity: 0.7, description: "Pistas de atletismo y deportes" },
  { id: "parques_infantiles", name: "Parques infantiles", icon: "Smile", color: "#E74C3C", category: "deporte", visible: false, opacity: 0.7, description: "Parques recreativos infantiles" },
  { id: "escuelas_deportivas", name: "Escuelas de formación deportiva", icon: "GraduationCap", color: "#2ECC71", category: "deporte", visible: false, opacity: 0.7, description: "Escuelas y academias deportivas" },
  { id: "estadios", name: "Estadios o polideportivos", icon: "Trophy", color: "#9B59B6", category: "deporte", visible: false, opacity: 0.7, description: "Estadios y complejos deportivos" },

  // ── SERVICIOS PÚBLICOS ──
  { id: "ptap", name: "Plantas de tratamiento de agua potable (PTAP)", icon: "Droplets", color: "#2980B9", category: "servicios", visible: false, opacity: 0.7, description: "Plantas de potabilización" },
  { id: "ptar", name: "Plantas de tratamiento de aguas residuales (PTAR)", icon: "Droplets", color: "#1ABC9C", category: "servicios", visible: false, opacity: 0.7, description: "Plantas de saneamiento" },
  { id: "alcantarillado_sanitario", name: "Red Local Sistema Alcantarillado Sanitario", icon: "Zap", color: "#7F8C8D", category: "servicios", visible: false, opacity: 0.7, description: "Red de alcantarillado sanitario" },
  { id: "acueducto", name: "Red Local Sistema Acueducto", icon: "Droplets", color: "#3498DB", category: "servicios", visible: false, opacity: 0.7, description: "Red de distribución de agua" },
  { id: "alcantarillado_pluvial", name: "Red Local Sistema Alcantarillado Pluvial", icon: "CloudRain", color: "#5DADE2", category: "servicios", visible: false, opacity: 0.7, description: "Red de drenaje pluvial" },
  { id: "hidrantes", name: "Hidrantes Sistema Acueducto", icon: "Flame", color: "#E74C3C", category: "servicios", visible: false, opacity: 0.7, description: "Ubicación de hidrantes" },
  { id: "alumbrado", name: "Alumbrado Público", icon: "Lightbulb", color: "#F1C40F", category: "servicios", visible: false, opacity: 0.7, description: "Red de alumbrado público" },
  { id: "rutas_residuos", name: "Rutas de recolección de residuos sólidos", icon: "Truck", color: "#95A5A6", category: "servicios", visible: false, opacity: 0.7, description: "Rutas de recolección de basura" },
  { id: "rellenos_sanitarios", name: "Rellenos sanitarios", icon: "Trash2", color: "#7F8C8D", category: "servicios", visible: false, opacity: 0.7, description: "Sitios de disposición final" },
  { id: "escombreras", name: "Escombreras", icon: "Construction", color: "#BDC3C7", category: "servicios", visible: false, opacity: 0.7, description: "Sitios de disposición de escombros" },
  { id: "rutas_aprovechables", name: "Rutas de recolección de residuos aprovechables", icon: "Recycle", color: "#2ECC71", category: "servicios", visible: false, opacity: 0.7, description: "Rutas de reciclaje" },
  { id: "conectividad_internet", name: "Conectividad a internet", icon: "Wifi", color: "#3498DB", category: "servicios", visible: false, opacity: 0.7, description: "Cobertura de internet" },

  // ── INDUSTRIA Y COMERCIO ──
  { id: "establecimientos_comerciales", name: "Establecimientos comerciales registrados", icon: "Store", color: "#E67E22", category: "industria", visible: false, opacity: 0.7, description: "Comercios registrados en cámara" },
  { id: "zonas_comerciales", name: "Zonas comerciales consolidadas", icon: "ShoppingBag", color: "#F39C12", category: "industria", visible: false, opacity: 0.7, description: "Áreas comerciales consolidadas" },
  { id: "zonas_industriales", name: "Zonas industriales", icon: "Factory", color: "#7F8C8D", category: "industria", visible: false, opacity: 0.7, description: "Áreas de actividad industrial" },
  { id: "microempresas", name: "Microempresas y emprendimientos", icon: "Briefcase", color: "#1ABC9C", category: "industria", visible: false, opacity: 0.7, description: "Registro de microempresas" },
  { id: "plazas_mercado", name: "Plazas de mercado", icon: "Store", color: "#E74C3C", category: "industria", visible: false, opacity: 0.7, description: "Plazas de mercado municipales" },
  { id: "vendedores_ambulantes", name: "Sectores con vendedores ambulantes", icon: "Users", color: "#D35400", category: "industria", visible: false, opacity: 0.7, description: "Zonas de venta ambulante" },

  // ── TURISMO ──
  { id: "atractivo_turistico", name: "Atractivo turístico", icon: "Camera", color: "#E74C3C", category: "turismo", visible: false, opacity: 0.7, description: "Puntos de interés turístico" },
  { id: "miradores", name: "Miradores", icon: "Eye", color: "#3498DB", category: "turismo", visible: false, opacity: 0.7, description: "Miradores y puntos panorámicos" },
  { id: "senderos_ecoturisticos", name: "Senderos ecoturísticos", icon: "Route", color: "#27AE60", category: "turismo", visible: false, opacity: 0.7, description: "Rutas de senderismo ecológico" },
  { id: "glamping", name: "Glamping", icon: "Tent", color: "#1ABC9C", category: "turismo", visible: false, opacity: 0.7, description: "Sitios de glamping y camping" },
  { id: "turismo_aventura", name: "Turismo de aventura", icon: "Compass", color: "#F39C12", category: "turismo", visible: false, opacity: 0.7, description: "Actividades de turismo aventura" },

  // ── CULTURA ──
  { id: "bienes_patrimoniales", name: "Bienes de interés cultural y patrimonial", icon: "Landmark", color: "#8E44AD", category: "cultura", visible: false, opacity: 0.7, description: "Patrimonio cultural protegido" },
  { id: "monumentos", name: "Monumentos", icon: "Landmark", color: "#D4AC0D", category: "cultura", visible: false, opacity: 0.7, description: "Monumentos históricos y artísticos" },
  { id: "salas_cine", name: "Salas de cine", icon: "Film", color: "#2C3E50", category: "cultura", visible: false, opacity: 0.7, description: "Salas de cine y teatros" },
  { id: "bibliotecas", name: "Bibliotecas", icon: "BookOpen", color: "#2980B9", category: "cultura", visible: false, opacity: 0.7, description: "Bibliotecas públicas y privadas" },
  { id: "museos", name: "Museos", icon: "Building2", color: "#6C3483", category: "cultura", visible: false, opacity: 0.7, description: "Museos y galerías de arte" },

  // ── EDUCACIÓN ──
  { id: "educacion", name: "Instituciones educativas preescolar, básica y media", icon: "GraduationCap", color: "#2ECC71", category: "educacion_cat", visible: false, opacity: 1, description: "Colegios y escuelas" },
  { id: "educacion_superior", name: "Instituciones de educación superior", icon: "GraduationCap", color: "#1ABC9C", category: "educacion_cat", visible: false, opacity: 0.7, description: "Universidades e instituciones superiores" },
  { id: "formacion_tecnica", name: "Entidades de formación técnica y tecnológica", icon: "Wrench", color: "#E67E22", category: "educacion_cat", visible: false, opacity: 0.7, description: "SENA y entidades técnicas" },
  { id: "desercion_escolar", name: "Tasa de deserción escolar", icon: "TrendingDown", color: "#E74C3C", category: "educacion_cat", visible: false, opacity: 0.7, description: "Tasas de deserción por zona" },
  { id: "transporte_escolar", name: "Beneficiarios de transporte escolar", icon: "Bus", color: "#F1C40F", category: "educacion_cat", visible: false, opacity: 0.7, description: "Cobertura de transporte escolar" },
  { id: "alimentacion_escolar", name: "Beneficiarios de alimentación escolar", icon: "UtensilsCrossed", color: "#27AE60", category: "educacion_cat", visible: false, opacity: 0.7, description: "Cobertura de alimentación escolar" },

  // ── SALUD Y PROTECCIÓN SOCIAL ──
  { id: "salud", name: "Instituciones prestadoras de salud", icon: "Hospital", color: "#E74C3C", category: "salud_cat", visible: false, opacity: 1, description: "Hospitales, clínicas y puestos de salud" },
  { id: "eps", name: "Empresas prestadoras de servicio", icon: "Heart", color: "#C0392B", category: "salud_cat", visible: false, opacity: 0.7, description: "EPS y aseguradoras de salud" },
  { id: "farmacias", name: "Establecimientos farmacéuticos", icon: "Pill", color: "#2ECC71", category: "salud_cat", visible: false, opacity: 0.7, description: "Farmacias y droguerías" },
  { id: "distribuidoras_medicamentos", name: "Distribuidoras de medicamentos", icon: "Package", color: "#3498DB", category: "salud_cat", visible: false, opacity: 0.7, description: "Distribuidoras farmacéuticas" },
  { id: "puestos_salud", name: "Puestos de salud", icon: "Hospital", color: "#E67E22", category: "salud_cat", visible: false, opacity: 0.7, description: "Puestos de salud rurales y urbanos" },
  { id: "primera_infancia", name: "Centros de atención a primera infancia", icon: "Baby", color: "#F1C40F", category: "salud_cat", visible: false, opacity: 0.7, description: "CDI y hogares comunitarios" },
  { id: "rehabilitacion", name: "Centros de rehabilitación física", icon: "Activity", color: "#9B59B6", category: "salud_cat", visible: false, opacity: 0.7, description: "Centros de fisioterapia" },
  { id: "brotes_epidemiologicos", name: "Zonas de brotes epidemiológicos históricos", icon: "AlertTriangle", color: "#C0392B", category: "salud_cat", visible: false, opacity: 0.7, description: "Historial de brotes epidémicos" },
  { id: "riesgo_vectores", name: "Áreas con riesgo por vectores", icon: "Bug", color: "#E74C3C", category: "salud_cat", visible: false, opacity: 0.7, description: "Zonas con riesgo de dengue/malaria" },

  // ── MOVILIDAD Y TRANSPORTE ──
  { id: "vias", name: "Red vial urbana", icon: "Road", color: "#E67E22", category: "movilidad", visible: false, opacity: 0.8, description: "Red vial urbana principal y secundaria" },
  { id: "vias_rural", name: "Red vial rural", icon: "Route", color: "#D35400", category: "movilidad", visible: false, opacity: 0.7, description: "Vías rurales y caminos" },
  { id: "transporte_publico", name: "Rutas de transporte público", icon: "Bus", color: "#3498DB", category: "movilidad", visible: false, opacity: 0.7, description: "Rutas de buses y colectivos" },
  { id: "red_semaforica", name: "Red semafórica", icon: "CircleDot", color: "#E74C3C", category: "movilidad", visible: false, opacity: 0.7, description: "Ubicación de semáforos" },
  { id: "terminales", name: "Terminales o puntos de transferencia modal", icon: "Building2", color: "#2C3E50", category: "movilidad", visible: false, opacity: 0.7, description: "Terminales de transporte" },
  { id: "transporte_informal", name: "Estaciones de transporte informal", icon: "Car", color: "#F39C12", category: "movilidad", visible: false, opacity: 0.7, description: "Puntos de transporte informal" },
  { id: "estacionamientos", name: "Estacionamientos públicos y privados", icon: "ParkingCircle", color: "#2980B9", category: "movilidad", visible: false, opacity: 0.7, description: "Parqueaderos registrados" },
  { id: "accidentalidad", name: "Puntos críticos de accidentalidad", icon: "AlertTriangle", color: "#C0392B", category: "movilidad", visible: false, opacity: 0.7, description: "Puntos de alta siniestralidad" },

  // ── CIENCIA, TECNOLOGÍA E INNOVACIÓN ──
  { id: "acceso_internet_publico", name: "Puntos de acceso público a internet", icon: "Wifi", color: "#3498DB", category: "ciencia", visible: false, opacity: 0.7, description: "Zonas WiFi gratuitas" },
  { id: "centros_investigacion", name: "Centros de investigación", icon: "Microscope", color: "#8E44AD", category: "ciencia", visible: false, opacity: 0.7, description: "Centros y laboratorios de investigación" },
  { id: "centros_tecnologicos", name: "Centros de desarrollo tecnológico", icon: "Cpu", color: "#1ABC9C", category: "ciencia", visible: false, opacity: 0.7, description: "Centros de innovación y tecnología" },

  // ── SEGURIDAD Y DEFENSA ──
  { id: "homicidios", name: "Homicidios", icon: "AlertTriangle", color: "#C0392B", category: "seguridad", visible: false, opacity: 0.7, description: "Mapa de homicidios por zona" },
  { id: "hurtos", name: "Hurtos", icon: "AlertTriangle", color: "#E74C3C", category: "seguridad", visible: false, opacity: 0.7, description: "Zonas con mayor incidencia de hurtos" },
  { id: "lesiones_personales", name: "Lesiones personales", icon: "AlertTriangle", color: "#D35400", category: "seguridad", visible: false, opacity: 0.7, description: "Incidencia de lesiones personales" },
  { id: "desapariciones", name: "Desapariciones", icon: "Search", color: "#7F8C8D", category: "seguridad", visible: false, opacity: 0.7, description: "Registro de desapariciones" },
  { id: "delitos_sexuales", name: "Delitos sexuales", icon: "ShieldAlert", color: "#8E44AD", category: "seguridad", visible: false, opacity: 0.7, description: "Mapa de delitos sexuales" },
  { id: "delitos_mujeres", name: "Delitos contra las mujeres", icon: "ShieldAlert", color: "#9B59B6", category: "seguridad", visible: false, opacity: 0.7, description: "Violencia de género por zonas" },
  { id: "violencia_intrafamiliar", name: "Violencia intrafamiliar", icon: "ShieldAlert", color: "#E74C3C", category: "seguridad", visible: false, opacity: 0.7, description: "Incidencia de VIF por zonas" },
  { id: "cuadrantes_policia", name: "Cuadrantes de policía", icon: "Shield", color: "#2C3E50", category: "seguridad", visible: false, opacity: 0.7, description: "División policial por cuadrantes" },

  // ── FUNCIÓN PÚBLICA ──
  { id: "gobierno", name: "Equipamientos y Sedes Gubernamentales", icon: "Landmark", color: "#F39C12", category: "funcion_publica", visible: false, opacity: 1, description: "Alcaldía, Catedral, Terminal y sedes institucionales" },
  { id: "notarias", name: "Notarías", icon: "FileText", color: "#2C3E50", category: "funcion_publica", visible: false, opacity: 0.7, description: "Notarías públicas" },
  { id: "concejos", name: "Concejos municipales", icon: "Users", color: "#3498DB", category: "funcion_publica", visible: false, opacity: 0.7, description: "Sede del concejo municipal" },
  { id: "personerias", name: "Personerías municipales", icon: "Scale", color: "#27AE60", category: "funcion_publica", visible: false, opacity: 0.7, description: "Personería municipal" },
  { id: "defensoria", name: "Defensoría del Pueblo", icon: "Shield", color: "#1ABC9C", category: "funcion_publica", visible: false, opacity: 0.7, description: "Defensoría del pueblo" },
  { id: "inspecciones_policia", name: "Inspecciones de policía", icon: "Shield", color: "#7F8C8D", category: "funcion_publica", visible: false, opacity: 0.7, description: "Inspecciones de policía" },
  { id: "comisarias_familia", name: "Comisarías de familia", icon: "Heart", color: "#E74C3C", category: "funcion_publica", visible: false, opacity: 0.7, description: "Comisarías de familia" },
  { id: "registraduria", name: "Registraduría", icon: "FileText", color: "#8E44AD", category: "funcion_publica", visible: false, opacity: 0.7, description: "Registraduría nacional del estado civil" },
  { id: "car", name: "Corporación Autónoma Regional", icon: "Leaf", color: "#27AE60", category: "funcion_publica", visible: false, opacity: 0.7, description: "CORPONOR - Autoridad ambiental" },
];

// Sample comunas polygons for Ocaña
export const comunasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Comuna 1 - Centro José Eusebio Caro", poblacion: 30722, area_habitantes: 85, estrato_predominante: 3, densidad: 361.4 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.362, 8.242], [-73.355, 8.242], [-73.355, 8.235],
          [-73.362, 8.235], [-73.362, 8.242]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 2 - Norte", poblacion: 25872, area_habitantes: 120, estrato_predominante: 2, densidad: 215.6 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.355, 8.242], [-73.348, 8.242], [-73.348, 8.235],
          [-73.355, 8.235], [-73.355, 8.242]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 3 - Sur Oriental Olaya Herrera", poblacion: 37393, area_habitantes: 95, estrato_predominante: 2, densidad: 393.6 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.362, 8.235], [-73.355, 8.235], [-73.355, 8.228],
          [-73.362, 8.228], [-73.362, 8.235]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 4 - Sur Occidental Adolfo Milanés", poblacion: 19808, area_habitantes: 150, estrato_predominante: 1, densidad: 132.1 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.355, 8.235], [-73.348, 8.235], [-73.348, 8.228],
          [-73.355, 8.228], [-73.355, 8.235]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Comuna 5 - La Costa", poblacion: 22632, area_habitantes: 110, estrato_predominante: 3, densidad: 205.7 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.233],
          [-73.368, 8.233], [-73.368, 8.240]
        ]]
      }
    },
  ]
};

// Sample barrios
export const barriosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Centro Histórico", comuna: "Comuna 1", estrato: 3, poblacion: 3200 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.240], [-73.357, 8.240], [-73.357, 8.237],
          [-73.360, 8.237], [-73.360, 8.240]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "La Primavera", comuna: "Comuna 2", estrato: 2, poblacion: 4500 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.353, 8.241], [-73.350, 8.241], [-73.350, 8.238],
          [-73.353, 8.238], [-73.353, 8.241]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Los Almendros", comuna: "Comuna 3", estrato: 2, poblacion: 5100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.234], [-73.357, 8.234], [-73.357, 8.231],
          [-73.360, 8.231], [-73.360, 8.234]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Villa del Rosario", comuna: "Comuna 4", estrato: 1, poblacion: 2800 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.354, 8.233], [-73.351, 8.233], [-73.351, 8.230],
          [-73.354, 8.230], [-73.354, 8.233]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "El Contento", comuna: "Comuna 5", estrato: 3, poblacion: 3800 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.367, 8.239], [-73.364, 8.239], [-73.364, 8.236],
          [-73.367, 8.236], [-73.367, 8.239]
        ]]
      }
    },
  ]
};

// Point data - Educational institutions (coordinates from addresses / OSM)
export const educacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Universidad Francisco de Paula Santander - Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: 8500, descripcion: "UFPS Sede Ocaña · Primera IES pública del nororiente colombiano" }, geometry: { type: "Point", coordinates: [-73.3625, 8.2285] } },
    { type: "Feature", properties: { nombre: "Universidad Santo Tomás CAU Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: null, descripcion: "Calle 10 N 10-40, Barrio Amargura · Fundada en 1980" }, geometry: { type: "Point", coordinates: [-73.3560, 8.2340] } },
    { type: "Feature", properties: { nombre: "UNAD CEAD Ocaña", tipo: "Universidad", nivel: "Superior", estudiantes: null, descripcion: "Calle 10 N. 9-47, Centro · Educación a distancia" }, geometry: { type: "Point", coordinates: [-73.3568, 8.2338] } },
    { type: "Feature", properties: { nombre: "Colegio Nacional José Eusebio Caro", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 1200, descripcion: "Calle 11 No. 9-81, Barrio San Francisco" }, geometry: { type: "Point", coordinates: [-73.3568, 8.2291] } },
    { type: "Feature", properties: { nombre: "Instituto Técnico Alfonso López", tipo: "Instituto", nivel: "Básica y Media", estudiantes: 950, descripcion: "Institución técnica pública" }, geometry: { type: "Point", coordinates: [-73.3545, 8.2310] } },
    { type: "Feature", properties: { nombre: "Colegio La Salle", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 800, descripcion: "Institución privada · Comunidad De La Salle" }, geometry: { type: "Point", coordinates: [-73.3575, 8.2320] } },
    { type: "Feature", properties: { nombre: "SENA Regional Ocaña", tipo: "Técnico", nivel: "Técnico y Tecnológico", estudiantes: 3200, descripcion: "Transv. 30 No. 7-10, Barrio La Primavera" }, geometry: { type: "Point", coordinates: [-73.3510, 8.2400] } },
    { type: "Feature", properties: { nombre: "Colegio Agustina Ferro", tipo: "Colegio", nivel: "Básica y Media", estudiantes: 700, descripcion: "Institución educativa oficial" }, geometry: { type: "Point", coordinates: [-73.3590, 8.2255] } },
  ]
};

// Point data - Health centers (coordinates from Waze/OSM)
export const saludGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Hospital Emiro Quintero Cañizares", tipo: "Hospital", nivel: 2, camas: 120, descripcion: "Calle 7 # 9-177 · Hospital público de referencia regional" }, geometry: { type: "Point", coordinates: [-73.3585, 8.2542] } },
    { type: "Feature", properties: { nombre: "Clínica Ocaña", tipo: "Clínica", nivel: 2, camas: 45, descripcion: "Institución prestadora de salud privada · Nivel II" }, geometry: { type: "Point", coordinates: [-73.3540, 8.2355] } },
    { type: "Feature", properties: { nombre: "Centro de Salud La Piñuela", tipo: "Centro de Salud", nivel: 1, camas: 10, descripcion: "Barrio La Piñuela · Atención primaria en salud" }, geometry: { type: "Point", coordinates: [-73.3520, 8.2390] } },
    { type: "Feature", properties: { nombre: "Centro de Atención Neuropsiquiátrico de Ocaña", tipo: "Centro Especializado", nivel: 2, camas: null, descripcion: "Salud mental, neuropsiquiatría y adicciones" }, geometry: { type: "Point", coordinates: [-73.3600, 8.2320] } },
    { type: "Feature", properties: { nombre: "Hospiclinic de Colombia SAS", tipo: "Clínica", nivel: 1, camas: null, descripcion: "Diagnóstico avanzado e imagenología" }, geometry: { type: "Point", coordinates: [-73.3530, 8.2350] } },
  ]
};

// Point data - Government (coordinates from official addresses)
export const gobiernoGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Alcaldía Municipal de Ocaña", tipo: "Gobierno Municipal", direccion: "Carrera 12 No. 10-42, Parque Principal" }, geometry: { type: "Point", coordinates: [-73.3540, 8.2354] } },
    { type: "Feature", properties: { nombre: "Registraduría Nacional", tipo: "Registraduría", direccion: "Calle 11 No. 16A-13, Barrio San Agustín" }, geometry: { type: "Point", coordinates: [-73.3490, 8.2360] } },
    { type: "Feature", properties: { nombre: "Fiscalía General de la Nación", tipo: "Justicia", direccion: "Centro de Ocaña" }, geometry: { type: "Point", coordinates: [-73.3548, 8.2358] } },
    { type: "Feature", properties: { nombre: "Defensoría del Pueblo", tipo: "Defensoría", direccion: "Centro de Ocaña" }, geometry: { type: "Point", coordinates: [-73.3545, 8.2350] } },
    { type: "Feature", properties: { nombre: "Catedral de Santa Ana", tipo: "Patrimonio Cultural", direccion: "Parque Principal, frente al Parque" }, geometry: { type: "Point", coordinates: [-73.3539, 8.2347] } },
    { type: "Feature", properties: { nombre: "Terminal de Transporte de Ocaña", tipo: "Transporte", direccion: "Av. Circunvalar Cra. 11 Nº 19-332" }, geometry: { type: "Point", coordinates: [-73.3620, 8.2450] } },
    { type: "Feature", properties: { nombre: "Centro Comercial Plazarella", tipo: "Comercio", direccion: "Carrera 14, 10-83" }, geometry: { type: "Point", coordinates: [-73.3520, 8.2350] } },
  ]
};

// Sample hydrography lines
export const hidrografiaGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Río Algodonal", tipo: "Río", longitud_km: 12.5 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.370, 8.245], [-73.365, 8.241], [-73.360, 8.238],
          [-73.355, 8.235], [-73.348, 8.230], [-73.342, 8.226]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Quebrada La Piñuela", tipo: "Quebrada", longitud_km: 4.2 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.358, 8.245], [-73.356, 8.242], [-73.354, 8.238],
          [-73.352, 8.234]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Quebrada Seca", tipo: "Quebrada", longitud_km: 3.1 },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.365, 8.236], [-73.362, 8.234], [-73.359, 8.232],
          [-73.356, 8.229]
        ]
      }
    },
  ]
};

// Sample land use
export const usoSueloGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Zona Urbana Central", uso: "Urbano", area_habitantes: 180 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.363, 8.243], [-73.350, 8.243], [-73.350, 8.230],
          [-73.363, 8.230], [-73.363, 8.243]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Zona Rural Norte", uso: "Agrícola", area_habitantes: 450 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.370, 8.250], [-73.345, 8.250], [-73.345, 8.243],
          [-73.370, 8.243], [-73.370, 8.250]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Zona de Protección", uso: "Protección Ambiental", area_habitantes: 320 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.370, 8.230], [-73.345, 8.230], [-73.345, 8.222],
          [-73.370, 8.222], [-73.370, 8.230]
        ]]
      }
    },
  ]
};

// Estratificación
export const estratificacionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Sector Centro", estrato: 3, viviendas: 2100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.361, 8.241], [-73.356, 8.241], [-73.356, 8.236],
          [-73.361, 8.236], [-73.361, 8.241]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Norte", estrato: 2, viviendas: 3200 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.356, 8.243], [-73.350, 8.243], [-73.350, 8.238],
          [-73.356, 8.238], [-73.356, 8.243]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Sur", estrato: 1, viviendas: 4100 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.360, 8.234], [-73.350, 8.234], [-73.350, 8.228],
          [-73.360, 8.228], [-73.360, 8.234]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Sector Occidental", estrato: 4, viviendas: 1500 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.368, 8.240], [-73.362, 8.240], [-73.362, 8.234],
          [-73.368, 8.234], [-73.368, 8.240]
        ]]
      }
    },
  ]
};

// Proyectos urbanos
export const proyectosGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nombre: "Renovación Plaza Principal", estado: "En ejecución", presupuesto: "2.500M COP", avance: 65 }, geometry: { type: "Point", coordinates: [-73.358, 8.238] } },
    { type: "Feature", properties: { nombre: "Nuevo Parque Lineal", estado: "En diseño", presupuesto: "4.200M COP", avance: 20 }, geometry: { type: "Point", coordinates: [-73.354, 8.235] } },
    { type: "Feature", properties: { nombre: "Ampliación Acueducto", estado: "En ejecución", presupuesto: "8.100M COP", avance: 40 }, geometry: { type: "Point", coordinates: [-73.350, 8.240] } },
  ]
};

// Vias
export const viasGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Vía Nacional Ocaña-Cúcuta", tipo: "Nacional", estado: "Bueno" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.370, 8.248], [-73.362, 8.243], [-73.355, 8.238],
          [-73.348, 8.233], [-73.340, 8.228]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Vía Ocaña-Ábrego", tipo: "Departamental", estado: "Regular" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.358, 8.238], [-73.363, 8.235], [-73.368, 8.232],
          [-73.373, 8.228]
        ]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Avenida Francisco Fernández de Contreras", tipo: "Urbana Principal", estado: "Bueno" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-73.362, 8.242], [-73.358, 8.238], [-73.354, 8.234]
        ]
      }
    },
  ]
};

// Statistics data for dashboard
export const dashboardStats = {
  // Fuente: DANE 2024
  poblacionTotal: 136427,
  areaUrbana: 696,       // hectáreas (6.96 km²)
  areaRural: 62076,      // hectáreas (620.76 km²)
  areaTotalHa: 67227,    // hectáreas (672.27 km²)
  numComunas: 5,
  numBarrios: 42,
  numVeredas: 90,
  numCorregimientos: 17,
  equipamientos: {
    educacion: 8,
    salud: 5,
    gobierno: 4,
    deportivo: 8,
    cultural: 6,
  },
  poblacionPorComuna: [
    { comuna: "1 · Centro JE Caro", poblacion: 30722, area: 85 },
    { comuna: "2 · Norte", poblacion: 25872, area: 120 },
    { comuna: "3 · Sur Oriental O.H.", poblacion: 37393, area: 95 },
    { comuna: "4 · Sur Occ. A.Milanés", poblacion: 19808, area: 150 },
    { comuna: "5 · La Costa", poblacion: 22632, area: 110 },
  ],
  estratificacion: [
    { estrato: "Estrato 1", porcentaje: 32, viviendas: 8200 },
    { estrato: "Estrato 2", porcentaje: 35, viviendas: 9100 },
    { estrato: "Estrato 3", porcentaje: 22, viviendas: 5600 },
    { estrato: "Estrato 4", porcentaje: 8, viviendas: 2100 },
    { estrato: "Estrato 5", porcentaje: 2, viviendas: 500 },
    { estrato: "Estrato 6", porcentaje: 1, viviendas: 200 },
  ],
  usoSuelo: [
    { uso: "Urbano", area: 696 },
    { uso: "Agrícola", area: 42000 },
    { uso: "Protección", area: 24531 },
  ],
  poblacionPorEdad: [
    { grupo: "Niños (<12)", cantidad: 24226, porcentaje: 17.8 },
    { grupo: "Adolescentes (12-17)", cantidad: 13488, porcentaje: 9.9 },
    { grupo: "Adultos (18-59)", cantidad: 79921, porcentaje: 58.6 },
    { grupo: "Adultos ≥60", cantidad: 18792, porcentaje: 13.8 },
  ],
  distribucionGenero: [
    { genero: "Mujeres", cantidad: 70999, porcentaje: 52 },
    { genero: "Hombres", cantidad: 65428, porcentaje: 48 },
  ],
};
