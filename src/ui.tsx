import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ThemeProvider from '@sweatpants/theme';
import Box from '@sweatpants/box';
import styled from 'styled-components';
import theme from './theme';

const buttonReset = `
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  width: auto;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`;

const LintButton = styled.button`
  ${buttonReset};
  background: none;
  border: 1px solid #333;
  border-radius: 5px;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.3rem 0.75rem;
`;

const StyledLayer = styled(Box)`
  border: 1px solid transparent;
  transition: 0.15s;

  &:hover {
    cursor: pointer;
    border: 1px solid #3daffb;
  }

  &:active,
  &:focus {
    background: #daebf7;
    outline: none;
    border: 1px solid transparent;
  }
`;

function App(): JSX.Element {
  const [errors, setErrors] = React.useState([]);
  const [hasLinted, setHasLinted] = React.useState(false);

  onmessage = (event) => {
    if (event.data.pluginMessage.type === 'linting-complete') {
      setErrors(event.data.pluginMessage.data.errors);
      setHasLinted(true);
    }
  };

  const errorCount = React.useMemo(() => {
    return errors.length;
  }, [errors]);

  const errorList = React.useMemo(() => {
    return errors.reduce((acc, error) => {
      if (!acc || acc.filter(({ id }) => id === error.id).length === 0) {
        acc.push({
          id: error.id,
          label: error.label,
          errors: [error.message],
        });
      } else {
        const index = acc.findIndex(({ id }) => id === error.id);
        acc[index] = {
          ...acc[index],
          errors: [...acc[index].errors, error.message],
        };
      }
      return acc;
    }, []);
  }, [errors]);

  function lint() {
    parent.postMessage({ pluginMessage: { type: 'lint' } }, '*');
  }

  function close() {
    parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
  }

  function focusNode(node) {
    parent.postMessage({ pluginMessage: { type: 'focus-node', node } }, '*');
  }

  return (
    <ThemeProvider theme={theme}>
      <Box textAlign="left">
        <Box borderBottom="1px solid #EEE" p="200" display="flex" alignItems="center">
          <Box flex="1">
            <LintButton onClick={lint}>Lint</LintButton>
          </Box>
          {hasLinted && (
            <Box textAlign="right" fontSize="50" color="red">
              {errorCount ? `${errorCount} errors found` : 'No errors found'}
            </Box>
          )}
        </Box>

        {errorList.length ? (
          <Box>
            <div>
              {errorList.map((error) => {
                return (
                  <Box>
                    <StyledLayer
                      as="div"
                      fontSize="50"
                      p="200"
                      tabIndex="0"
                      color="#333"
                      key={error.id}
                      onClick={() => focusNode(error.id)}
                    >
                      <Box mb="100" fontWeight="500">
                        {error.label}
                      </Box>
                      <Box as="ul" m="0" p="0">
                        {error.errors.map((msg) => (
                          <Box as="li" fontSize="50" pl="500" color="#333" lineHeight="100">
                            {msg}
                          </Box>
                        ))}
                      </Box>
                    </StyledLayer>
                  </Box>
                );
              })}
            </div>
          </Box>
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('react-page'));
