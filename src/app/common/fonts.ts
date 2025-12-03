import BreeShHeadlineRegular from '../../assets/fonts/Bree-SH-Headline-Regular.woff'
import ShIcons from '../../assets/fonts/sh-icons.woff'
import Sisan03 from '../../assets/fonts/sisan03.woff'
import Sisan08 from '../../assets/fonts/sisan08.woff'
import Sisan33 from '../../assets/fonts/sisan33.woff'
import Sisan38 from '../../assets/fonts/sisan38.woff'

export const shIcons = {
    fontFamily: 'sh-icons',
    fontStyle: 'normal',
    fontWeight: 500,
    src: `
      local('sh-icons'),
      url(${ShIcons}) format('woff'),
      url(${ShIcons}) format('woff2')`
}

export const sisan03 = {
    fontFamily: 'siemens sans',
    fontStyle: 'normal',
    fontWeight: 500,
    src: `
      local('siemens sans'),
      url(${Sisan03}) format('woff'),
      url(${Sisan03}) format('woff2')`
}

export const sisan33 = {
    fontFamily: 'siemens sans',
    fontStyle: 'italic',
    fontWeight: 500,
    src: `
      local('siemens sans'),
      url(${Sisan33}) format('woff'),
      url(${Sisan33}) format('woff2')
    `
}

export const sisan08 = {
    fontFamily: 'siemens sans',
    fontStyle: 'normal',
    fontWeight: 900,
    src: `
      local('siemens sans'),
      url(${Sisan08}) format('woff'),
      url(${Sisan08}) format('woff2')
    `
}

export const sisan38 = {
    fontFamily: 'siemens sans',
    fontStyle: 'italic',
    fontWeight: 900,
    src: `
      local('siemens sans'),
      url(${Sisan38}) format('woff'),
       url(${Sisan38}) format('woff2')
    `
}

export const breeHeadline = {
    fontFamily: 'bree-headline',
    fontStyle: 'normal',
    fontWeight: 500,
    src: `
      local('bree-headline'),
      url(${BreeShHeadlineRegular}) format('woff'),
       url(${BreeShHeadlineRegular}) format('woff2')
    `
}
