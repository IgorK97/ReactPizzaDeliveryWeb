import { createTheme } from "@mui/material";
/**
 * Тема приложения Material-UI
 */

const mainTheme = createTheme({
   
    /**
     * Цветовая схема
     */
    colorSchemes:{
      /**
       * Темная цветовая схема
       */
      dark:{
        palette: {
          mode: 'dark',
          primary: {
            main: '#1a1a1a', 
            contrastText: '#2D2D2D',
          },
          secondary: {
            main: '#FFFFFF', 
          },
          error:{
            main:'#D32F2F',
        },
          background: {
            default: '#1A1A1A', 
            paper: '#5c5b58', 
          },
          text: {
            primary: '#FFFFFF', 
            secondary: '#FF8C5A', 

          },
        },
        
       
      },
      /**
       * Светлая цветовая схема
       */
      light:{
        palette:{
          mode: 'light',
          primary:{
              main:'#D41515',
              contrastText:'#ffffff',
          },
          secondary:{
              main:'#2D2D2D',
          },
          error:{
              main:'#D32F2F',
          },
          background:{
              default:'#FFFFFF',
              paper:'#FDA538',

          },
          text:{
              // primary:'#1E3EE6',
              primary:'#6A1B9A',
              secondary:'#FFFFF',
          },
          
      },
      }
     
    },
    
    /**
     * Настройки шрифтов
     */
    typography:{
        fontFamily:[
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
    },
    /**
     * Отдельная настройка для компонентов
     */
    components:{
      
      /**
       * Для кнопок MUI
       */
        MuiButton:{
          /**
           * Варианты кнопок
           */
            variants: [
                {
                  /**
                   * Только для contained были определены особенности стиля
                   *  (цвета фона и текста, а также при наведении)
                   */
                  props: { variant: 'contained' },
                  style: ( {theme} ) => ({
                  
                      backgroundColor: theme.palette.mode === 'dark' ?  "#A27EE2" : "#9c27b0",
                        color: theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFF',
                        '&:hover':{
                           backgroundColor: theme.palette.mode === 'dark' ? "#AF75D2" : "#6A1B9A" ,
                        }
                  
                  }),
                },
              ],
           
        },
    },
});
export default mainTheme;