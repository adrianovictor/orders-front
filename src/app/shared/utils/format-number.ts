export class FormatNumber {
    static formatBrazilianNumber(value: number | string, decimals: number = 2): string {
        // Converte para número se for string
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        
        // Verifica se é um número válido
        if (isNaN(numericValue)) {
          return '0,00';
        }
        
        // Fixa o número de casas decimais e converte para string
        const fixedValue = numericValue.toFixed(decimals);
        
        // Divide em parte inteira e decimal
        const [integerPart, decimalPart] = fixedValue.split('.');
        
        // Formata a parte inteira com pontos para milhares
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Monta o resultado final com vírgula como separador decimal
        return `${formattedInteger},${decimalPart}`;
      }
}

