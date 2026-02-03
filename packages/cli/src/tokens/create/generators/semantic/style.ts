import type { Token, TokenSet } from '../../../types.js';

export function generateSemanticStyle() {
  return {
    typography: {
      heading: {
        '2xl': {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.10}',
            letterSpacing: '{letter-spacing.1}',
          },
        },
        xl: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.9}',
            letterSpacing: '{letter-spacing.1}',
          },
        },
        lg: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.8}',
            letterSpacing: '{letter-spacing.2}',
          },
        },
        md: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.7}',
            letterSpacing: '{letter-spacing.3}',
          },
        },
        sm: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.6}',
            letterSpacing: '{letter-spacing.5}',
          },
        },
        xs: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.5}',
            letterSpacing: '{letter-spacing.6}',
          },
        },
        '2xs': {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.medium}',
            lineHeight: '{line-height.sm}',
            fontSize: '{font-size.4}',
            letterSpacing: '{letter-spacing.6}',
          },
        },
      },
      body: {
        xl: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.regular}',
            lineHeight: '{line-height.md}',
            fontSize: '{font-size.6}',
            letterSpacing: '{letter-spacing.8}',
          },
        },
        lg: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.regular}',
            lineHeight: '{line-height.md}',
            fontSize: '{font-size.5}',
            letterSpacing: '{letter-spacing.8}',
          },
        },
        md: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.regular}',
            lineHeight: '{line-height.md}',
            fontSize: '{font-size.4}',
            letterSpacing: '{letter-spacing.8}',
          },
        },
        sm: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.regular}',
            lineHeight: '{line-height.md}',
            fontSize: '{font-size.3}',
            letterSpacing: '{letter-spacing.7}',
          },
        },
        xs: {
          $type: 'typography',
          $value: {
            fontFamily: '{font-family}',
            fontWeight: '{font-weight.regular}',
            lineHeight: '{line-height.md}',
            fontSize: '{font-size.2}',
            letterSpacing: '{letter-spacing.6}',
          },
        },
        short: {
          xl: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.sm}',
              fontSize: '{font-size.6}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          lg: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.sm}',
              fontSize: '{font-size.5}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          md: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.sm}',
              fontSize: '{font-size.4}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          sm: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.sm}',
              fontSize: '{font-size.3}',
              letterSpacing: '{letter-spacing.7}',
            },
          },
          xs: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.sm}',
              fontSize: '{font-size.2}',
              letterSpacing: '{letter-spacing.6}',
            },
          },
        },
        long: {
          xl: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.lg}',
              fontSize: '{font-size.6}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          lg: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.lg}',
              fontSize: '{font-size.5}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          md: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.lg}',
              fontSize: '{font-size.4}',
              letterSpacing: '{letter-spacing.8}',
            },
          },
          sm: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.lg}',
              fontSize: '{font-size.3}',
              letterSpacing: '{letter-spacing.7}',
            },
          },
          xs: {
            $type: 'typography',
            $value: {
              fontFamily: '{font-family}',
              fontWeight: '{font-weight.regular}',
              lineHeight: '{line-height.lg}',
              fontSize: '{font-size.2}',
              letterSpacing: '{letter-spacing.6}',
            },
          },
        },
      },
    },
    opacity: {
      disabled: {
        $type: 'opacity',
        $value: '{opacity.30}',
      },
    },
    'border-width': {
      default: {
        $type: 'borderWidth',
        $value: '{border-width.1}',
      },
      focus: {
        $type: 'borderWidth',
        $value: '{border-width.3}',
      },
    },
    shadow: {
      xs: {
        $type: 'boxShadow',
        $value: '{shadow.100}',
      },
      sm: {
        $type: 'boxShadow',
        $value: '{shadow.200}',
      },
      md: {
        $type: 'boxShadow',
        $value: '{shadow.300}',
      },
      lg: {
        $type: 'boxShadow',
        $value: '{shadow.400}',
      },
      xl: {
        $type: 'boxShadow',
        $value: '{shadow.500}',
      },
    },
    'border-radius': {
      sm: {
        $type: 'dimension',
        $value: '{border-radius.1}',
      },
      md: {
        $type: 'dimension',
        $value: '{border-radius.2}',
      },
      lg: {
        $type: 'dimension',
        $value: '{border-radius.3}',
      },
      xl: {
        $type: 'dimension',
        $value: '{border-radius.4}',
      },
      default: {
        $type: 'dimension',
        $value: '{border-radius.5}',
      },
      full: {
        $type: 'dimension',
        $value: '{border-radius.6}',
      },
    },
    size: {
      '0': {
        $type: 'dimension',
        $value: '{_size.0}',
      },
      '1': {
        $type: 'dimension',
        $value: '{_size.1}',
      },
      '2': {
        $type: 'dimension',
        $value: '{_size.2}',
      },
      '3': {
        $type: 'dimension',
        $value: '{_size.3}',
      },
      '4': {
        $type: 'dimension',
        $value: '{_size.4}',
      },
      '5': {
        $type: 'dimension',
        $value: '{_size.5}',
      },
      '6': {
        $type: 'dimension',
        $value: '{_size.6}',
      },
      '7': {
        $type: 'dimension',
        $value: '{_size.7}',
      },
      '8': {
        $type: 'dimension',
        $value: '{_size.8}',
      },
      '9': {
        $type: 'dimension',
        $value: '{_size.9}',
      },
      '10': {
        $type: 'dimension',
        $value: '{_size.10}',
      },
      '11': {
        $type: 'dimension',
        $value: '{_size.11}',
      },
      '12': {
        $type: 'dimension',
        $value: '{_size.12}',
      },
      '13': {
        $type: 'dimension',
        $value: '{_size.13}',
      },
      '14': {
        $type: 'dimension',
        $value: '{_size.14}',
      },
      '15': {
        $type: 'dimension',
        $value: '{_size.15}',
      },
      '18': {
        $type: 'dimension',
        $value: '{_size.18}',
      },
      '22': {
        $type: 'dimension',
        $value: '{_size.22}',
      },
      '26': {
        $type: 'dimension',
        $value: '{_size.26}',
      },
      '30': {
        $type: 'dimension',
        $value: '{_size.30}',
      },
    },
  } satisfies TokenSet;
}

function generateSingleTypographyToken(component: 'heading' | 'body', size: string, variant?: 'short' | 'long'): Token {
  const prefix = `typography-mapping.${component}${variant ? `.${variant}` : ''}.${size}`;
  return {
    $type: 'typography',
    $value: {
      fontFamily: `{${prefix}.font-family}`,
      fontWeight: `{${prefix}.font-weight}`,
      lineHeight: `{${prefix}.line-height}`,
      fontSize: `{${prefix}.font-size}`,
      letterSpacing: `{${prefix}.letter-spacing}`,
    },
  };
}

function _generateTypography() {
  const headingSizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs'];
  const heading = Object.fromEntries(
    headingSizes.map((size) => [size, generateSingleTypographyToken('heading', size)] as const),
  );
  const bodySizes = ['xl', 'lg', 'md', 'sm', 'xs'];
  const body = Object.fromEntries(
    bodySizes.map((size) => [size, generateSingleTypographyToken('body', size)] as const),
  );
  const bodyShort = Object.fromEntries(
    bodySizes.map((size) => [size, generateSingleTypographyToken('body', size, 'short')] as const),
  );
  const bodyLong = Object.fromEntries(
    bodySizes.map((size) => [size, generateSingleTypographyToken('body', size, 'long')] as const),
  );
  return {
    heading,
    body: {
      ...body,
      short: bodyShort,
      long: bodyLong,
    },
  };
}
