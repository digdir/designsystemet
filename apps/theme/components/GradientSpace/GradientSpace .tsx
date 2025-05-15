import { Heading } from '@digdir/designsystemet-react';
import type { ColorNames, ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import classes from './GradientSpace.module.css';

type GradientSpaceProps = {
  themeInfo: ThemeInfo;
  colorScheme: 'light' | 'dark' | 'contrast';
};

export const GradientSpace = ({
  themeInfo,
  colorScheme,
}: GradientSpaceProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const colors = colorScheme === 'light' ? themeInfo.light : themeInfo.dark;
  const [hue, setHue] = useState(0);
  const width = 860;
  const height = 300;
  const [hexColors, setHexColors] = useState<string[]>([]);
  let hslColors: { h: number; s: number; l: number }[] = [];
  const backgroundColor = '#00a6ff';
  const surfaceColor = '#0ad100';
  const borderColor = 'orange';
  const textColor = 'red';

  const names: ColorNames[] = [
    'background-default',
    'background-tinted',
    'surface-default',
    'surface-tinted',
    'surface-hover',
    'surface-active',
    'border-subtle',
    'border-default',
    'border-strong',
    'text-subtle',
    'text-default',
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = 0;

    // Filter and map colors for HSL
    hslColors = colors
      .filter((color) => names.includes(color.name))
      .map((color) => {
        const hsl = chroma(color.hex).hsv();

        return {
          h: hsl[0], // Accessing the hue value
          s: hsl[1] * 100, // Convert to percentage
          l: hsl[2] * 100, // Convert to percentage
        };
      });

    // Filter and map colors for hexColors
    const filteredHexColors = colors
      .filter((color) => names.includes(color.name))
      .map((color) => color.hex);

    setHexColors(filteredHexColors);

    // Set the hue to the first color's hue (or any other logic)
    if (hslColors.length > 0) {
      setHue(hslColors[4].h);
    }

    // Clear previous SVG content
    svg.selectAll('*').remove();

    // Scales for positioning colors
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin, width + margin]); // Saturation (left to right)
    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height + margin, margin]); // Lightness (bottom to top)

    // Draw lines connecting the colors
    svg
      .append('path')
      .datum(hslColors.map(({ s, l }) => [s, l]) as [number, number][])
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<[number, number]>()
          .x((d) => xScale(d[0])) // X = Saturation
          .y((d) => yScale(d[1])), // Y = Lightness // Smooth curves
      );

    const getStrokeColor = (index: number) => {
      if (index === 0 || index === 1) {
        return backgroundColor;
      }
      if (index === 2 || index === 3 || index === 4 || index === 5) {
        return surfaceColor;
      }
      if (index === 6 || index === 7 || index === 8) {
        return borderColor;
      }
      if (index === 9 || index === 10) {
        return textColor;
      }

      return '#242424';
    };

    // Draw points for each color
    svg
      .selectAll('circle')
      .data(hslColors)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.s))
      .attr('cy', (d) => yScale(d.l))
      .attr('r', 6)
      .style('fill', (d, i) => getStrokeColor(i))
      .style('stroke', (d, i) => '#242424') // Use strokeColors based on index
      .style('stroke-width', 2);
  }, [colors]);

  return (
    <div>
      <Heading data-size='xs' className={classes.heading}>
        Gradient Space
      </Heading>
      <div className={classes.gradientSpace}>
        <svg
          style={{
            background: `linear-gradient(to right, hsl(0, 0%, 100%), hsl(${hue}, 100%, 50%)), linear-gradient(to bottom, hsla(200, 100%, 50%, 0), hsl(200, 100%, 0%))`,
          }}
          className={classes.svg}
          ref={svgRef}
          width={width}
          height={height}
        ></svg>
      </div>
      <div className={classes.items}>
        <div className={classes.item}>
          <div
            className={classes.dot}
            style={{ backgroundColor: backgroundColor }}
          ></div>
          <div className={classes.name}>Background</div>
        </div>
        <div className={classes.item}>
          <div
            className={classes.dot}
            style={{ backgroundColor: surfaceColor }}
          ></div>
          <div className={classes.name}>Surface</div>
        </div>
        <div className={classes.item}>
          <div
            className={classes.dot}
            style={{ backgroundColor: borderColor }}
          ></div>
          <div className={classes.name}>Border</div>
        </div>
        <div className={classes.item}>
          <div
            className={classes.dot}
            style={{ backgroundColor: textColor }}
          ></div>
          <div className={classes.name}>Text</div>
        </div>
      </div>
    </div>
  );
};
