import classes from "./PreviewBox.module.css";
import {
  Button,
  Switch,
  Chip,
  Textfield,
  Checkbox,
  Spinner,
  Link,
  Tabs,
  Search,
  Pagination,
  Radio,
  ToggleGroup,
  Heading,
} from "@digdir/designsystemet-react";

export const PreviewBox = () => {
  return (
    <div className={classes.box} id="preview">
      <div className={classes.login}>
        <Heading className={classes.title}>Logg inn</Heading>
        <Textfield
          label="Brukernavn"
          className={classes.input}
          placeholder="Ola Normann"
          size="small"
        />
        <Textfield
          label="Passord"
          className={classes.input}
          placeholder="********"
          size="small"
        />
        <Link className={classes.link} href="#">
          Glemt passord?
        </Link>
        <Button className={classes.btn} fullWidth size="small">
          Logg inn
        </Button>
      </div>
      <div>
        <Tabs defaultValue="value1" size="small">
          <Tabs.List>
            <Tabs.Tab value="value1">Tab 1</Tabs.Tab>
            <Tabs.Tab value="value2">Tab 2</Tabs.Tab>
            <Tabs.Tab value="value3">Tab 3</Tabs.Tab>
            <Tabs.Tab value="value4">Tab 4</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <div className={classes.checkList}>
          <Checkbox size="small" value="value">
            Lasagne
          </Checkbox>
          <Checkbox size="small" value="value">
            Pizza
          </Checkbox>
          <Checkbox size="small" value="value">
            Spaghetti
          </Checkbox>
          <Checkbox size="small" value="value" checked>
            Taco
          </Checkbox>
          <Checkbox size="small" value="value" checked>
            Hamburger
          </Checkbox>
        </div>
        <div className={classes.chips}>
          <Chip.Toggle size="small">Chip</Chip.Toggle>
          <Chip.Toggle size="small" selected checkmark={false}>
            Chip
          </Chip.Toggle>
          <Chip.Toggle size="small" selected>
            Chip
          </Chip.Toggle>
        </div>
        <div className={classes.spinners}>
          <Spinner size="medium" title="Henter kaffi" variant="interaction" />
          <ToggleGroup
            defaultValue="Peanut"
            name="toggle-group-nuts"
            size="small"
          >
            <ToggleGroup.Item>Peanut</ToggleGroup.Item>
            <ToggleGroup.Item>Walnut</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div className={classes.right}>
        <Search
          className={classes.search}
          error=""
          label="Label"
          placeholder="Søk her..."
          size="small"
          variant="primary"
        />
        <div className={classes.buttons}>
          <Button size="small">
            <Spinner variant="interaction" title="loading" size="xsmall" />
            Button
          </Button>
          <Button size="small" variant="secondary">
            Button
          </Button>
          <Button size="small" variant="tertiary">
            Button
          </Button>
        </div>
        <div className={classes.switches}>
          <Switch />
          <Switch checked />
          <Switch checked disabled />
        </div>
        <div className={classes.pagination}>
          <Pagination
            currentPage={2}
            nextLabel="Neste"
            previousLabel="Forrige"
            size="small"
            totalPages={3}
          />
        </div>
        <div className={classes.radios}>
          <Radio
            size="small"
            value="sjokolade"
            className={classes.radio}
            checked
          >
            Sjokolade
          </Radio>
          <Radio size="small" value="sjokolade" className={classes.radio}>
            Jordbær
          </Radio>
        </div>
      </div>
    </div>
  );
};
