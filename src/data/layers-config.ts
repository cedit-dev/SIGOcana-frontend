export interface LayerConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  visible: boolean;
  opacity: number;
  description: string;
  geometryType?: GeoJSON.Geometry["type"];
  source?: "core" | "custom";
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
