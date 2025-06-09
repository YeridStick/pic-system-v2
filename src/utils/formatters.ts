/**
 * Formatea un número como moneda colombiana
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  /**
   * Formatea un número como moneda con decimales
   */
  export const formatCurrencyWithDecimals = (amount: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };
  
  /**
   * Formatea un porcentaje
   */
  export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  };
  
  /**
   * Formatea un número con separadores de miles
   */
  export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-CO').format(value);
  };
  
  /**
   * Formatea una fecha en formato colombiano
   */
  export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };
  
  /**
   * Formatea una fecha en formato colombiano
   */
  export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  /**
   * Formatea una fecha en formato corto (DD/MM/YYYY)
   */
  export const formatDateShort = (date: string | Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  };
  
  /**
   * Formatea un número como porcentaje completo (0.25 -> 25%)
   */
  export const formatPercentageFromDecimal = (decimal: number, decimals: number = 1): string => {
    return formatPercentage(decimal * 100, decimals);
  };
  
  /**
   * Formatea bytes en formato legible (KB, MB, GB)
   */
  export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Formatea un número de teléfono colombiano
   */
  export const formatPhoneNumber = (phone: string): string => {
    // Remover todos los caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formato para celular colombiano (3XX XXX XXXX)
    if (cleaned.length === 10 && cleaned.startsWith('3')) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    
    // Formato para teléfono fijo (XXX XXXX)
    if (cleaned.length === 7) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    
    return phone; // Retornar original si no coincide con formatos conocidos
  };
  
  /**
   * Formatea texto en formato título (Primera Letra Mayúscula)
   */
  export const formatTitle = (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Trunca texto a una longitud específica
   */
  export const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Formatea un tamaño de archivo desde bytes
   */
  export const formatFileSize = (sizeInBytes: number): string => {
    return formatBytes(sizeInBytes);
  };
  
  /**
   * Convierte un valor decimal a porcentaje para display
   */
  export const decimalToPercentage = (decimal: number): number => {
    return decimal * 100;
  };
  
  /**
   * Convierte un porcentaje a decimal para cálculos
   */
  export const percentageToDecimal = (percentage: number): number => {
    return percentage / 100;
  };
  
  /**
   * Formatea un ID de documento (ej: cedula, NIT)
   */
  export const formatDocumentId = (id: string, type: 'CC' | 'NIT' = 'CC'): string => {
    const cleaned = id.replace(/\D/g, '');
    
    if (type === 'NIT') {
      // Formato NIT: XXX.XXX.XXX-X
      if (cleaned.length >= 9) {
        const mainPart = cleaned.slice(0, -1);
        const checkDigit = cleaned.slice(-1);
        const formatted = mainPart.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        return `${formatted}-${checkDigit}`;
      }
    }
    
    // Formato CC: XXX.XXX.XXX
    if (cleaned.length >= 7) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    }
    
    return id;
  };
  
  /**
   * Formatea una cantidad con unidad
   */
  export const formatQuantity = (quantity: number, unit: string = 'unidad'): string => {
    const unitLabel = quantity === 1 ? unit : `${unit}es`;
    return `${formatNumber(quantity)} ${unitLabel}`;
  };
  
  /**
   * Formatea un rango de valores
   */
  export const formatRange = (min: number, max: number, formatter: (n: number) => string = formatNumber): string => {
    return `${formatter(min)} - ${formatter(max)}`;
  };
  
  /**
   * Formatea un valor con sufijo de escala (K, M, B)
   */
  export const formatWithScale = (value: number, decimals: number = 1): string => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(decimals)}B`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(decimals)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(decimals)}K`;
    }
    return formatNumber(value);
  };
  
  /**
   * Formatea una diferencia/cambio con signo
   */
  export const formatChange = (value: number, isPercentage: boolean = false): string => {
    const sign = value >= 0 ? '+' : '';
    const formatted = isPercentage ? formatPercentage(Math.abs(value)) : formatNumber(Math.abs(value));
    return `${sign}${value >= 0 ? '' : '-'}${formatted}`;
  };
  
  /**
   * Limpia y formatea un input de moneda
   */
  export const cleanCurrencyInput = (input: string): number => {
    // Remover todo excepto números y puntos decimales
    const cleaned = input.replace(/[^\d.,]/g, '');
    // Reemplazar comas por puntos para el formato decimal
    const normalized = cleaned.replace(',', '.');
    return parseFloat(normalized) || 0;
  };
  
  /**
   * Formatea un valor para input de moneda
   */
  export const formatCurrencyInput = (value: number): string => {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /**
   * Capitaliza la primera letra de un texto
   */
  export const capitalize = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };