import React from "react";

interface LogoLidercellProps {
  color: string;
  colorSecondary: string;
  stroke: string;
  className?: string;
}

const Logo: React.FC<LogoLidercellProps> = ({
  color,
  colorSecondary,
  stroke,
  className,
}) => {
  return (
    <svg
      id="Capa_2"
      data-name="Capa 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 374.29 82"
      className={className}
    >
      <g id="Capa_1-2" data-name="Capa 1">
        <g>
          <path
            d="M94.4,64.05c-.36-.36-.53-.87-.53-1.53V25.32c0-.67.14-1.18.43-1.53.29-.36.7-.53,1.23-.53s.97.18,1.25.53.42.87.42,1.53v35.93h21.27c.67,0,1.18.14,1.53.42s.53.69.53,1.25-.18.94-.53,1.23-.87.43-1.53.43h-22.53c-.67,0-1.18-.18-1.53-.53Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M125.96,64.05c-.29-.36-.43-.87-.43-1.53V25.32c0-.67.14-1.18.43-1.53.29-.36.7-.53,1.23-.53s.97.18,1.25.53.42.87.42,1.53v37.2c0,.67-.14,1.18-.42,1.53s-.69.53-1.25.53-.94-.18-1.23-.53Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M169.08,33.57c-1.86-3.17-4.37-5.68-7.53-7.53-3.17-1.86-6.62-2.78-10.35-2.78h-8.6c-.67,0-1.18.14-1.53.42-.36.28-.53.69-.53,1.25s.18.94.53,1.23c.35.29.87.43,1.53.43h8.6c3.16,0,6.06.77,8.7,2.32s4.74,3.64,6.3,6.3c1.56,2.66,2.33,5.56,2.33,8.72s-.78,6.03-2.33,8.68c-1.56,2.66-3.66,4.76-6.32,6.32-2.66,1.56-5.55,2.33-8.68,2.33h-8.6c-.67,0-1.18.14-1.53.42-.36.28-.53.69-.53,1.25s.18.94.53,1.23c.35.29.87.43,1.53.43h8.6c3.73,0,7.18-.93,10.35-2.78,3.17-1.86,5.68-4.37,7.53-7.53,1.85-3.17,2.78-6.62,2.78-10.35s-.93-7.18-2.78-10.35Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M178.06,64.05c-.36-.36-.53-.87-.53-1.53V25.32c0-.67.18-1.18.53-1.53s.87-.53,1.53-.53h22.53c.67,0,1.18.14,1.54.42.35.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.54.43h-21.27v34.4h21.27c.67,0,1.18.16,1.54.47.35.31.53.76.53,1.33s-.18,1.02-.53,1.33c-.36.31-.87.47-1.54.47h-22.53c-.67,0-1.18-.18-1.53-.53ZM182.73,44.82c-.36-.29-.53-.7-.53-1.23s.18-.97.53-1.25c.35-.28.87-.42,1.53-.42h6.53c.67,0,1.18.14,1.53.42.36.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-6.53c-.67,0-1.18-.14-1.53-.43Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M222.59,45.25h6.93c2,0,3.84-.49,5.52-1.48,1.68-.99,3.01-2.32,4-4,.99-1.68,1.48-3.52,1.48-5.52s-.49-3.87-1.47-5.55c-.98-1.68-2.31-3.01-3.98-3.98-1.68-.98-3.53-1.47-5.55-1.47h-12.93c-.67,0-1.18.14-1.53.42s-.53.69-.53,1.25.18.94.53,1.23c.36.29.87.43,1.53.43h12.93c1.38,0,2.66.35,3.83,1.05,1.18.7,2.11,1.64,2.8,2.82.69,1.18,1.03,2.44,1.03,3.8s-.34,2.66-1.03,3.83c-.69,1.18-1.62,2.11-2.8,2.8-1.18.69-2.46,1.03-3.83,1.03h-11.4c-.58,0-1.02.11-1.33.32-.31.21-.47.5-.47.85,0,.42.24.88.73,1.37l19.07,19.07c.38.38.77.65,1.17.82.4.17.87.25,1.4.25.47,0,.83-.09,1.1-.28.27-.19.4-.44.4-.75,0-.47-.28-.97-.83-1.5l-16.77-16.8Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M256.94,61.8c-3.17-1.86-5.68-4.37-7.53-7.53-1.86-3.17-2.78-6.62-2.78-10.35s.93-7.18,2.78-10.35,4.37-5.68,7.53-7.53,6.62-2.78,10.35-2.78h8.6c.67,0,1.18.14,1.53.42s.53.69.53,1.25-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-8.6c-3.11,0-5.99.77-8.65,2.32-2.66,1.54-4.77,3.64-6.33,6.3-1.57,2.66-2.35,5.56-2.35,8.72s.78,6.03,2.35,8.68c1.57,2.66,3.68,4.76,6.33,6.32,2.66,1.56,5.54,2.33,8.65,2.33h8.6c.67,0,1.18.14,1.53.42s.53.69.53,1.25-.18.94-.53,1.23-.87.43-1.53.43h-8.6c-3.73,0-7.18-.93-10.35-2.78Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M284.16,64.05c-.36-.36-.53-.87-.53-1.53V25.32c0-.67.18-1.18.53-1.53s.87-.53,1.53-.53h22.53c.67,0,1.18.14,1.53.42.35.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-21.27v34.4h21.27c.67,0,1.18.16,1.53.47.35.31.53.76.53,1.33s-.18,1.02-.53,1.33c-.36.31-.87.47-1.53.47h-22.53c-.67,0-1.18-.18-1.53-.53ZM288.83,44.82c-.36-.29-.53-.7-.53-1.23s.18-.97.53-1.25c.36-.28.87-.42,1.53-.42h6.53c.67,0,1.18.14,1.53.42.36.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-6.53c-.67,0-1.18-.14-1.53-.43Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M316.49,64.05c-.36-.36-.53-.87-.53-1.53V25.32c0-.67.14-1.18.43-1.53.29-.36.7-.53,1.23-.53s.97.18,1.25.53c.28.36.42.87.42,1.53v35.93h21.27c.67,0,1.18.14,1.53.42.35.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-22.53c-.67,0-1.18-.18-1.53-.53Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M348.16,64.05c-.36-.36-.53-.87-.53-1.53V25.32c0-.67.14-1.18.43-1.53.29-.36.7-.53,1.23-.53s.97.18,1.25.53c.28.36.42.87.42,1.53v35.93h21.27c.67,0,1.18.14,1.53.42.35.28.53.69.53,1.25s-.18.94-.53,1.23c-.36.29-.87.43-1.53.43h-22.53c-.67,0-1.18-.18-1.53-.53Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
        </g>
        <circle
          cx="41"
          cy="41"
          r="40"
          style={{
            fill: colorSecondary,
            stroke: stroke,
            strokeMiterlimit: "10",
            strokeWidth: "2px",
          }}
        />
        <g>
          <path
            d="M17.62,57.63c-.3-.3-.44-.72-.44-1.28v-31c0-.55.12-.98.36-1.28.24-.3.58-.44,1.03-.44s.81.15,1.04.44c.23.3.35.72.35,1.28v29.95h17.72c.56,0,.98.12,1.28.35.3.23.44.58.44,1.04s-.15.79-.44,1.03c-.3.24-.72.36-1.28.36h-18.78c-.56,0-.98-.15-1.28-.44Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
          <path
            d="M47.86,55.76c-2.64-1.55-4.73-3.64-6.28-6.28-1.55-2.64-2.32-5.51-2.32-8.62s.77-5.99,2.32-8.62c1.55-2.64,3.64-4.73,6.28-6.28,2.64-1.55,5.51-2.32,8.62-2.32h7.17c.56,0,.98.12,1.28.35.3.23.44.58.44,1.04s-.15.79-.44,1.03c-.3.24-.72.36-1.28.36h-7.17c-2.59,0-5,.64-7.21,1.93s-3.97,3.04-5.28,5.25c-1.31,2.21-1.96,4.63-1.96,7.26s.65,5.02,1.96,7.24c1.31,2.21,3.06,3.97,5.28,5.26,2.21,1.3,4.62,1.95,7.21,1.95h7.17c.56,0,.98.12,1.28.35.3.23.44.58.44,1.04s-.15.79-.44,1.03c-.3.24-.72.36-1.28.36h-7.17c-3.11,0-5.99-.77-8.62-2.32Z"
            style={{ fill: color, strokeWidth: "0px" }}
          />
        </g>
      </g>
    </svg>
  );
};

export default Logo;