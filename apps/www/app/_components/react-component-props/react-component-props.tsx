import { Table, Tag } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { forwardRef, type HTMLAttributes } from 'react';
import type { ComponentDoc } from 'react-docgen-typescript';
import classes from './react-component-props.module.css';

type ReactComponentProps = {
  docs: ComponentDoc[];
} & HTMLAttributes<HTMLDivElement>;

export const ReactComponentDocs = forwardRef<
  HTMLTableElement,
  ReactComponentProps
>(function CssVariables({ docs, ...rest }, ref) {
  if (!docs || docs.length === 0) {
    return null;
  }
  return (
    <div
      {...rest}
      ref={ref}
      className={cl(classes.wrapper, 'u-long-content')}
      data-color='accent'
      lang='en'
    >
      {docs
        .filter((doc) => Object.keys(doc.props).length > 0)
        .map((doc, index) => (
          <div key={doc.displayName} className={classes.component}>
            {index > 0 && <h3 className='ds-heading'>{doc.displayName}</h3>}
            <div className={classes.props}>
              {Object.entries(doc.props).map(([name, prop]) => (
                <dl key={name}>
                  <dt className={classes.propName}>
                    <Tag>{name}</Tag>
                    {prop.required && (
                      <span className={classes.required}>Required</span>
                    )}
                  </dt>
                  {prop.description && (
                    <>
                      <dt>Description</dt>
                      <dd>{prop.description}</dd>
                    </>
                  )}
                  {prop.type && (
                    <>
                      <dt>Type</dt>
                      <dd className={classes.type}>
                        <code>
                          {prop.type.raw ? prop.type.raw : prop.type.name}
                        </code>
                      </dd>
                    </>
                  )}
                  {prop.defaultValue && (
                    <>
                      <dt>Default</dt>
                      <dd className={classes.default}>
                        <code>{prop.defaultValue.value}</code>
                      </dd>
                    </>
                  )}
                </dl>
              ))}
            </div>
            <Table
              data-color='neutral'
              data-size='sm'
              border
              className={classes.table}
            >
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Default</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {Object.entries(doc.props).map(([name, prop]) => (
                  <Table.Row key={name}>
                    <Table.Cell>
                      <Tag data-color='accent'>{name}</Tag>
                      {prop.required && (
                        <span className={classes.required}>Required</span>
                      )}
                    </Table.Cell>
                    <Table.Cell data-color='accent' className={classes.type}>
                      <code>
                        {prop.type?.raw ? prop.type.raw : prop.type?.name}
                      </code>
                    </Table.Cell>
                    <Table.Cell className={classes.default}>
                      {prop.defaultValue ? (
                        <Tag>{prop.defaultValue.value}</Tag>
                      ) : (
                        '-'
                      )}
                    </Table.Cell>
                    <Table.Cell>{prop.description || '-'}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ))}
    </div>
  );
});
