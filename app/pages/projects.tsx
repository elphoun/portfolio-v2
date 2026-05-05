'use client'

import { useState } from 'react'
import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { Fredericka_the_Great } from "next/font/google"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'] })

type Leaf = {
  id: string
  href: string
  leafId: string // unique ID for each individual leaf
  component: (props: { isHovered: boolean; href: string }) => React.ReactNode
  className: string
}

const Leaf1 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="375" height="180" viewBox="0 0 375 180" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter0_g_239_39)" pointerEvents="none">
        <path d="M365.93 171.51C346.906 142.5 315.906 123.5 232.906 101" stroke="#414141" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter1_g_239_39)">
          <path d="M233.083 100.251C239.252 134.996 182.4 153.787 155.264 148.671C128.128 143.554 7.96705 77.1408 11.4874 58.4698C15.0078 39.7988 150.64 24.1582 177.776 29.2746C204.912 34.391 251.267 68.5716 233.083 100.251Z" fill="black" />
          <path d="M233.083 100.251C239.252 134.996 182.4 153.787 155.264 148.671C128.128 143.554 7.96705 77.1408 11.4874 58.4698C15.0078 39.7988 150.64 24.1582 177.776 29.2746C204.912 34.391 251.267 68.5716 233.083 100.251Z" stroke="#414141" strokeWidth="4" />
        </g>
        <mask id="mask0_239_39" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="89" y="43" width="77" height="77">
          <rect x="79.9883" y="105.707" width="76.364" height="74.8723" rx="37.4361" transform="rotate(-71.6649 79.9883 105.707)" fill="black" />
        </mask>
        <g mask="url(#mask0_239_39)">
          <path d="M111.54 85.725C111.54 85.725 117.374 82.1865 119.002 78.459C121.21 73.4025 118.764 69.7418 117.23 64.4418C115.51 58.5008 110.242 50.2292 110.242 50.2292C110.242 50.2292 112.014 47.9023 113.68 47.4789C115.853 46.9268 119.13 49.2847 119.13 49.2847L117.238 44.3703C117.238 44.3703 119.651 42.0235 121.631 41.7376C123.923 41.4066 127.259 43.6028 127.259 43.6028L134.787 39.6521L151.467 45.18C151.467 45.18 157.274 50.7447 158.806 55.4203C160.752 61.3589 160.852 66.0371 157.607 71.3773C154.761 76.0599 147.257 79.6456 147.257 79.6456L139.366 85.2078L142.781 93.1537C142.781 93.1537 146.767 99.6371 146.72 104.227C146.657 110.543 143.735 114.319 138.904 118.388C133.721 122.755 122.353 123.608 122.353 123.608C122.353 123.608 112.086 119.477 108.197 114.061C106.941 112.312 105.504 109.25 105.504 109.25C105.504 109.25 101.349 109.818 99.5786 108.281C98.0687 106.969 97.6271 103.545 97.6271 103.545L102.376 99.8379C102.376 99.8379 98.3403 99.7725 96.9272 98.0321C95.8433 96.6971 95.8117 93.7725 95.8117 93.7725L111.54 85.725Z" fill="#545454" />
        </g>
        <path d="M138.431 84.9412C138.431 84.9412 135.514 90.0211 138.202 92.5736C143.585 97.6848 161.986 90.3758 161.986 90.3758C161.986 90.3758 150.605 75.5005 143.543 76.4559C139.87 76.9529 138.431 84.9412 138.431 84.9412Z" fill="#C07B23" />
        <path d="M132.662 81.7913C132.662 81.7913 134.004 88.8632 137.108 91.8109C143.324 97.7133 158.909 89.2632 158.909 89.2632C158.909 89.2632 150.366 75.3063 142.212 76.4096C137.97 76.9836 132.662 81.7913 132.662 81.7913Z" fill="#DEA357" />
        <path d="M140.747 80.9523C141.524 81.2098 140.235 82.4971 139.687 84.1503C139.139 85.8034 139.464 87.4267 138.687 87.1691C137.91 86.9116 137.425 85.2354 137.973 83.5822C138.521 81.9291 139.97 80.6948 140.747 80.9523Z" fill="white" fillOpacity="0.66" />
        <path d="M140.378 49.1709C148.502 51.8633 154.478 55.888 151.316 65.4307C148.518 73.8732 141.024 74.4281 132.9 71.7356C124.776 69.0432 119.088 64.1487 121.894 55.6806C124.701 47.2124 132.253 46.4785 140.378 49.1709Z" fill="white" />
        <path d="M137.536 56.8038C141.718 58.1897 145.987 60.4295 144.359 65.3415C142.919 69.6872 137.953 69.5488 133.772 68.1629C129.59 66.777 126.184 64.156 127.628 59.7971C129.073 55.4382 133.354 55.4179 137.536 56.8038Z" fill="black" />
        <ellipse cx="129.895" cy="64.0958" rx="3.34203" ry="3.50374" transform="rotate(-71.6649 129.895 64.0958)" fill="white" />
        <path d="M127.065 89.3372C135.19 92.0296 141.166 96.0542 138.003 105.597C135.205 114.04 127.712 114.594 119.588 111.902C111.463 109.209 105.776 104.315 108.582 95.8468C111.388 87.3786 118.941 86.6447 127.065 89.3372Z" fill="white" />
        <path d="M125.682 92.5697C129.864 93.9556 134.133 96.1954 132.505 101.107C131.065 105.453 126.1 105.315 121.918 103.929C117.736 102.543 114.33 99.9219 115.775 95.563C117.219 91.2041 121.5 91.1838 125.682 92.5697Z" fill="black" />
        <ellipse cx="117.719" cy="100.834" rx="3.34203" ry="3.50374" transform="rotate(-71.6649 117.719 100.834)" fill="white" />
      </g>
      <defs>
        <filter id="filter0_g_239_39" x="225.383" y="92.0698" width="149.219" height="87.5374" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_39">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_39" x="2.41211" y="19.2925" width="243.797" height="139.209" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_39">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
)

const Leaf2 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="346" height="371" viewBox="0 0 346 371" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter2_g_239_40)" pointerEvents="none">
        <path d="M337.037 362.656C291.518 288.916 259 201 194.5 169.5" stroke="#3D5929" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter0_g_239_40)">
          <path d="M195.617 165.966C189.297 191.929 153.118 209.245 136.729 198.594C120.339 187.942 20.6706 123.222 28.5814 111.049C36.4921 98.8771 149.688 78.9867 166.078 89.6382C182.467 100.29 217.104 148.492 195.617 165.966Z" fill="#4F9359" fillOpacity="0.39" />
          <path d="M195.617 165.966C189.297 191.929 153.118 209.245 136.729 198.594C120.339 187.942 20.6706 123.222 28.5814 111.049C36.4921 98.8771 149.688 78.9867 166.078 89.6382C182.467 100.29 217.104 148.492 195.617 165.966Z" stroke="#3D5929" strokeWidth="4" />
        </g>
        <g filter="url(#filter1_g_239_40)">
          <path d="M27.2091 113.099C27.2091 113.099 57.586 110.239 75.853 112.073M178.732 155.137L149.51 134.364M75.853 112.073C88.7742 104.097 107.071 97.3722 107.071 97.3722M75.853 112.073C82.3479 121.597 90.616 142.182 90.616 142.182M75.853 112.073C89.8514 111.935 103.905 117.333 117.904 117.195M149.51 134.364C149.51 134.364 129.257 121.392 117.904 117.195M149.51 134.364L178.083 125.22M149.51 134.364L145.874 165.652M117.904 117.195C129.801 108.76 156.83 104.738 156.83 104.738M117.904 117.195C121.021 127.765 123.944 150.096 123.944 150.096" stroke="#435F2F" strokeWidth="2" />
        </g>
      </g>
      <defs>
        <filter id="filter0_g_239_40" x="19.1348" y="77.6062" width="192.309" height="133.178" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_40">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_40" x="22.1152" y="91.4304" width="162.191" height="79.3406" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="3799" />
          <feDisplacementMap in="shape" scale="10" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_40">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter2_g_239_40" x="186.623" y="160.703" width="159.115" height="210.004" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_40">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
)

const Leaf3 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="188" height="454" viewBox="0 0 188 454" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter1_g_239_41)" pointerEvents="none">
        <path d="M176.874 446.382C176.874 359.539 197.033 286.181 109.517 182.181" stroke="black" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter0_g_239_41)">
          <path d="M106.122 183.462C90.3172 201.901 26.2837 159.603 26.2837 159.603L59.1465 102.177L15.1015 109.13C15.1015 109.13 44.6123 87.2385 38.6604 85.0801C18.0974 77.623 -9.08008 35.6761 25.6658 13.9696C59.1465 -6.94651 91.0105 43.9819 84.6549 59.0685C78.2993 74.1551 125.65 65.8774 125.65 65.8774L90.3172 84.138L160.528 109.655C160.528 109.655 133.92 183.462 106.122 183.462Z" fill="url(#pattern0_239_41)" />
          <path d="M106.122 183.462C90.3172 201.901 26.2837 159.603 26.2837 159.603L59.1465 102.177L15.1015 109.13C15.1015 109.13 44.6123 87.2385 38.6604 85.0801C18.0974 77.623 -9.08008 35.6761 25.6658 13.9696C59.1465 -6.94651 91.0105 43.9819 84.6549 59.0685C78.2993 74.1551 125.65 65.8774 125.65 65.8774L90.3172 84.138L160.528 109.655C160.528 109.655 133.92 183.462 106.122 183.462Z" stroke="#010101" strokeWidth="4" />
        </g>
      </g>
      <defs>
        <filter id="filter0_g_239_41" x="0" y="0" width="170.086" height="197.115" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_41">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_41" x="100.986" y="173.894" width="86.8926" height="279.489" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_41">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <pattern id="pattern0_239_41" patternUnits="userSpaceOnUse" patternTransform="matrix(1.90233 65.9655 -65.9655 1.90233 108.47 63.4941)" preserveAspectRatio="none" viewBox="0 0 65.9929 65.9929" width="1" height="1">
          <use xlinkHref="#pattern0_239_41_inner" transform="translate(0 -65.9929)" />
          <g id="pattern0_239_41_inner">
            <pattern id="pattern1_239_41" patternUnits="userSpaceOnUse" patternTransform="matrix(2028 0 0 1014 -474.004 -474.004)" preserveAspectRatio="none" viewBox="0 0 600 300" width="1" height="1">
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(-300 -450)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(0 -600)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(300 -450)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(-300 -150)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(0 -300)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(300 -150)" />
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(-300 150)" />
              <g id="pattern1_239_41_inner">
                <rect width="150" height="150" transform="matrix(1 0 0 -1 0 150)" fill="#312E2B" />
                <rect width="150" height="150" transform="matrix(1 0 0 -1 150 150)" fill="#BEBDB9" />
                <rect width="150" height="150" transform="matrix(1 0 0 -1 150 300)" fill="#312E2B" />
                <rect width="150" height="150" transform="matrix(1 0 0 -1 0 300)" fill="#BEBDB9" />
              </g>
              <use xlinkHref="#pattern1_239_41_inner" transform="translate(300 150)" />
            </pattern><rect width="65.9929" height="65.9929" fill="url(#pattern1_239_41)" />
          </g>
        </pattern></defs>
    </svg>
  </a>
)

const Leaf4 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="198" height="419" viewBox="0 0 198 419" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter2_g_239_42)" pointerEvents="none">
        <path d="M9 411.76C9 339.26 25.6055 205.781 70.1055 157.781" stroke="#3D5929" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter0_g_239_42)">
          <path d="M70.0334 158.099C40.6883 149.244 38.0955 105.457 48.203 89.7681C58.3104 74.079 138.311 20.7933 152.572 29.9809C166.833 39.1686 149.508 132.832 139.401 148.521C129.293 164.21 91.5367 181.6 70.0334 158.099Z" fill="#4F9359" fillOpacity="0.39" />
          <path d="M70.0334 158.099C40.6883 149.244 38.0955 105.457 48.203 89.7681C58.3104 74.079 138.311 20.7933 152.572 29.9809C166.833 39.1686 149.508 132.832 139.401 148.521C129.293 164.21 91.5367 181.6 70.0334 158.099Z" stroke="#3D5929" strokeWidth="4" />
        </g>
        <g filter="url(#filter1_g_239_42)">
          <path d="M148.933 38.0974L131.001 65.9318M70.2079 157.015L90.7085 125.193M131.001 65.9318L141.816 99.4297M131.001 65.9318L96.7797 70.4159M131.001 65.9318L113.798 92.6345M90.7085 125.193L113.798 92.6345M90.7085 125.193L104.022 149.85M90.7085 125.193L60.3605 126.947M113.798 92.6345L128.896 126.078M113.798 92.6345L78.4787 98.8232" stroke="#435F2F" strokeWidth="2" />
        </g>
      </g>
      <defs>
        <filter id="filter0_g_239_42" x="33.8496" y="19.9236" width="133.129" height="158.648" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_42">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_42" x="55.3047" y="32.5603" width="99.4727" height="129.992" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="3799" />
          <feDisplacementMap in="shape" scale="10" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_42">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter2_g_239_42" x="0" y="149.421" width="78.5723" height="269.338" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_42">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
)

const Leaf5 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="341" height="309" viewBox="0 0 341 309" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter2_g_239_43)" pointerEvents="none">
        <path d="M8.70117 300.917C54.2207 227.177 104.826 144.542 180.326 118.542" stroke="black" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter0_gn_239_43)">
          <path d="M180.958 119.37C159.881 97.1145 179.367 57.8174 195.93 49.2158C212.492 40.6141 308.391 34.0728 316.21 49.1282C324.029 64.1836 262.492 136.89 245.929 145.491C229.366 154.093 187.958 150.445 180.958 119.37Z" fill="#011B0A" />
          <path d="M180.958 119.37C159.881 97.1145 179.367 57.8174 195.93 49.2158C212.492 40.6141 308.391 34.0728 316.21 49.1282C324.029 64.1836 262.492 136.89 245.929 145.491C229.366 154.093 187.958 150.445 180.958 119.37Z" stroke="black" strokeWidth="4" />
        </g>
        <g filter="url(#filter1_g_239_43)">
          <path d="M219.622 116.533L248.437 118.263L235.528 92.4425L219.622 116.533ZM279.549 86.5703L278.431 84.3342L238.628 104.235L239.746 106.471L240.864 108.707L280.667 88.8064L279.549 86.5703Z" fill="#C31313" />
          <path d="M268.144 63.7621L252.238 87.8521L239.328 62.032L268.144 63.7621ZM208.217 93.7244L207.099 91.4883L246.901 71.588L248.019 73.8241L249.137 76.0602L209.335 95.9605L208.217 93.7244Z" fill="#C31313" />
        </g>
      </g>
      <defs>
        <filter id="filter0_gn_239_43" x="162.758" y="31.1326" width="163.135" height="127.383" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_43">
            <feMergeNode in="displacedImage" />
          </feMerge>
          <feTurbulence type="fractalNoise" baseFrequency="0.83333331346511841 0.83333331346511841" stitchTiles="stitch" numOctaves="3" result="noise" seed="1091" />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " />
          </feComponentTransfer>
          <feComposite operator="in" in2="effect1_texture_239_43" in="coloredNoise1" result="noise1Clipped" />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
          <feMerge result="effect2_noise_239_43">
            <feMergeNode in="effect1_texture_239_43" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_43" x="204.1" y="59.032" width="79.5664" height="62.2307" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.76923078298568726 0.76923078298568726" numOctaves="3" seed="4545" />
          <feDisplacementMap in="shape" scale="6" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_43">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter2_g_239_43" x="0" y="109.651" width="187.977" height="199.317" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_43">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
)

const Leaf6 = ({ isHovered, href }: { isHovered: boolean; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'contents' }}
  >
    <svg width="325" height="168" viewBox="0 0 325 168" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ opacity: isHovered ? 1 : 1 }}>
      {/* Stem - not interactive */}
      <g filter="url(#filter2_g_239_44)" pointerEvents="none">
        <path d="M8.59375 145.51C26.0117 122.57 26.0117 119.57 92.0117 107.57" stroke="#3D5929" strokeWidth="4" />
      </g>
      {/* Leaf - interactive */}
      <g pointerEvents="auto">
        <g filter="url(#filter0_g_239_44)">
          <path d="M91.6636 108.605C72.422 79.0242 117.429 39.5323 144.41 33.651C171.391 27.7697 307.943 42.0135 311.99 60.5776C316.036 79.1416 197.268 146.482 170.287 152.363C143.307 158.245 87.2867 144.869 91.6636 108.605Z" fill="#4F9359" fillOpacity="0.39" />
          <path d="M91.6636 108.605C72.422 79.0242 117.429 39.5323 144.41 33.651C171.391 27.7697 307.943 42.0135 311.99 60.5776C316.036 79.1416 197.268 146.482 170.287 152.363C143.307 158.245 87.2867 144.869 91.6636 108.605Z" stroke="#3D5929" strokeWidth="4" />
        </g>
        <g filter="url(#filter1_g_239_44)">
          <path d="M299.599 64.8134L251.732 75.2475M93.0158 107.808L147.74 95.8787M251.732 75.2475L225.984 112.076M251.732 75.2475L213.206 53.4529M251.732 75.2475L205.811 85.2575M147.74 95.8787L205.811 85.2575M147.74 95.8787L134.054 126.998M147.74 95.8787L115.989 74.6443M205.811 85.2575L184.335 125.249M205.811 85.2575L164.353 64.1018" stroke="#435F2F" strokeWidth="2" />
        </g>
      </g>
      <defs>
        <filter id="filter0_g_239_44" x="78.0059" y="23.3076" width="243.086" height="139.39" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_44">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter1_g_239_44" x="87.8027" y="47.5825" width="217.01" height="84.8181" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="3799" />
          <feDisplacementMap in="shape" scale="10" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_44">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <filter id="filter2_g_239_44" x="0" y="98.6025" width="99.3691" height="55.1174" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="2408" />
          <feDisplacementMap in="shape" scale="14" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect1_texture_239_44">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
)

export const ProjectsPage = () => {
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null)

  const leaves: Leaf[] = [
    { id: 'leaf1', href: 'https://github.com/claireleu/Duoslango', leafId: 'leaf1', component: Leaf1, className: "w-32 md:w-96" },
    { id: 'leaf2', href: '', leafId: 'leaf2', component: Leaf2, className: "w-32 md:w-fit md:-z-10" },
    { id: 'leaf3', href: 'https://github.com/elphoun/viennalytics', leafId: 'leaf3', component: Leaf3, className: "w-20 md:w-40" },
    { id: 'leaf4', href: '', leafId: 'leaf4', component: Leaf4, className: "w-20 md:w-40" },
    { id: 'leaf5', href: 'https://github.com/elphoun/Pokedex-Calculator', leafId: 'leaf5', component: Leaf5, className: "w-32 md:w-96 md:-z-10" },
    { id: 'leaf6', href: '', leafId: 'leaf6', component: Leaf6, className: "w-32 md:w-96" },
  ]

  return (
    <SectionContainer id="projects">
      <div className="flex flex-col items-center justify-end w-full h-full relative px-4 md:px-0">
        <h1 className={`absolute left-2 md:left-0 top-1/2 -translate-y-1/2 ${fredericka.className} text-4xl md:text-[72px] lg:text-[96px] rotate--90 leading-none text-[#FAEED6]`}>
          PROJECTS
        </h1>
        <AnimatedSvg src="/projects/pot.svg" className='absolute h-16 md:h-32 lg:h-72 w-auto' />

        {/* Leaves - positioned so right edge is at center */}
        {leaves.map((leaf, index) => (
          <div
            key={leaf.leafId}
            className={`absolute h-auto bottom-32 md:bottom-64 left-1/2 ${leaf.className}`}
            onMouseEnter={() => setHoveredLeaf(leaf.leafId)}
            onMouseLeave={() => setHoveredLeaf(null)}
            style={{
              transform: index < leaves.length / 2 ? 'translateX(-100%)' : 'translateX(0%)',
              opacity: hoveredLeaf && hoveredLeaf !== leaf.leafId ? 0.5 : 1,
              transition: 'opacity 200ms ease-out',
            } as React.CSSProperties}
          >
            {leaf.component({ isHovered: hoveredLeaf === leaf.leafId, href: leaf.href })}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
