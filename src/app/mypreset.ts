import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        },
        secondary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#f5f5f5',
                    50: 'var(--color-coinly-highlight)',
                    100: 'var(--color-coinly-highlight)',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            }
        },
        focusRing: {
            width: '2px',
            style: 'solid',
            radius: '8px',
            color: '{secondary.950}',
            shadow: '0 0 0 2px {secondary.950}',
            offset: '1px'
        }
    }
});

export default MyPreset;