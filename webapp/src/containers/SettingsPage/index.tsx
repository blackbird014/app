import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import isEqual from 'lodash/isEqual';
import {
  getInitialSettingsRequest,
  updateSettingsRequest,
  getSettingOptionsRequest,
} from './reducer';
import SettingsTabsHeader from './components/SettingsTabHeader';
import SettingsTabsFooter from './components/SettingsTabFooter';
import { TabContent } from 'reactstrap';
import SettingsTabGeneral from './components/SettingsTabGeneral';
import SettingsTabDisplay from './components/SettingsTabDisplay';
import usePrevious from '../../components/UsePrevious';
import { getPageTitle } from '../../utils/utility';

interface SettingsPageProps {
  isFetching: boolean;
  settingsError: string;
  languages: { label: string; value: string }[];
  amountUnits: { label: string; value: string }[];
  displayModes: { label: string; value: string }[];
  appConfig: {
    language: string;
    unit: string;
    displayMode: string;
    network: string;
    launchAtLogin: boolean;
    minimizedAtLaunch: boolean;
    pruneBlockStorage: boolean;
    scriptVerificationThreads: number;
    blockStorage: number;
    databaseCache: number;
    maximumAmount: number;
    maximumCount: number;
    feeRate: number;
    reindexAfterSaving: boolean;
  };
  isUpdating: boolean;
  isUpdated: boolean;
  launchAtLogin: boolean;
  minimizedAtLaunch: boolean;
  reindexAfterSaving: boolean;
  isRestart: boolean;
  getInitialSettingsRequest: () => void;
  getSettingOptionsRequest: () => void;
  updateSettings: (data: any) => void;
  changeLanguage: () => void;
}

interface SettingsPageState {
  activeTab: string;
  language?: string;
  unit?: string;
  network?: string;
  displayMode?: string;
  launchAtLogin?: boolean;
  minimizedAtLaunch?: boolean;
  pruneBlockStorage?: boolean;
  scriptVerificationThreads?: number;
  blockStorage?: number;
  databaseCache?: number;
  maximumAmount?: number;
  maximumCount?: number;
  feeRate?: number | string;
  isUnsavedChanges: boolean;
}

const SettingsPage: React.FunctionComponent<SettingsPageProps> = (
  props: SettingsPageProps
) => {
  const [state, setState] = useState<SettingsPageState>({
    activeTab: 'general',
    ...props.appConfig,
    isUnsavedChanges: false,
  });

  const [reindexAfterSaving, setIsReindexAfterSaving] = useState(false);

  useEffect(() => {
    props.getSettingOptionsRequest();
    props.getInitialSettingsRequest();
  }, []);
  const prevProps: any = usePrevious(props);
  const prevState: any = usePrevious(state) || {};
  const setSettingsPageState = (updatedObject: any) => {
    const updatedState = Object.assign({}, state, updatedObject);
    setState(updatedState);
  };

  useEffect(() => {
    if (!props.isRestart) {
      setIsReindexAfterSaving(false);
    }
  }, [props.isRestart]);

  useEffect(() => {
    const prevPropsValue =
      !!prevProps && !!prevProps.appConfig ? prevProps.appConfig : {};
    if (!isEqual(props.appConfig, prevPropsValue)) {
      setSettingsPageState({
        ...props.appConfig,
        isUnsavedChanges: false,
      });
    }
  }, [props, prevProps]);

  useEffect(() => {
    if (!isEqual(prevState, state)) {
      checkForChanges();
    }
  }, [prevState, state]);

  const setActiveTab = (tab: string) => {
    if (state.activeTab !== tab) {
      setSettingsPageState({
        activeTab: tab,
      });
    }
  };

  const handleDropDowns = (data: any, field: any) => {
    setSettingsPageState({
      [field]: data,
    });
  };

  const handleToggles = (field: string) => {
    setSettingsPageState({
      [field]: !state[field],
    });
  };

  const handeReindexToggle = () => {
    setIsReindexAfterSaving(!reindexAfterSaving);
  };

  const handleFractionalNumInputs = (
    event: { target: { name: string; value: string } },
    field: string
  ) => {
    if (isNaN(Number(event.target.value)) && event.target.value !== '') {
      return false;
    }

    setSettingsPageState({ [field]: event.target.value } as {
      feeRate: number | string;
    });
  };

  const handleRegularNumInputs = (
    event: { target: { name: string; value: string } },
    field: string
  ) => {
    setSettingsPageState({
      [field]: /^-?[0-9]+$/.test(event.target.value)
        ? parseInt(event.target.value, 10)
        : '',
    } as {
      scriptVerificationThreads: number;
      blockStorage: number;
      databaseCache: number;
      maximumAmount: number;
      maximumCount: number;
    });
  };

  const checkForChanges = () => {
    const keys = [
      'language',
      'unit',
      'displayMode',
      'network',
      'launchAtLogin',
      'minimizedAtLaunch',
      'pruneBlockStorage',
      'scriptVerificationThreads',
      'blockStorage',
      'databaseCache',
      'maximumAmount',
      'maximumCount',
      'feeRate',
    ];

    let isUnsavedChanges = false;

    keys.forEach((key) => {
      if (!isUnsavedChanges && props.appConfig[key] !== state[key]) {
        isUnsavedChanges = true;
      }
    });

    const { launchAtLogin, minimizedAtLaunch } = state;

    setSettingsPageState({
      isUnsavedChanges,
      minimizedAtLaunch: !launchAtLogin ? false : minimizedAtLaunch,
    });
  };

  const saveChanges = () => {
    const {
      language,
      unit,
      displayMode,
      network,
      launchAtLogin,
      minimizedAtLaunch,
      pruneBlockStorage,
      scriptVerificationThreads,
      blockStorage,
      databaseCache,
      maximumAmount,
      maximumCount,
      feeRate,
    } = state;

    const settings = {
      language,
      unit,
      displayMode,
      network,
      launchAtLogin,
      minimizedAtLaunch,
      pruneBlockStorage,
      scriptVerificationThreads,
      blockStorage,
      databaseCache,
      maximumAmount,
      maximumCount,
      feeRate,
      reindexAfterSaving: reindexAfterSaving,
    };
    props.updateSettings(settings);
  };

  const {
    activeTab,
    isUnsavedChanges,
    launchAtLogin,
    minimizedAtLaunch,
    pruneBlockStorage,
    blockStorage,
    databaseCache,
    maximumAmount,
    maximumCount,
    feeRate,
    scriptVerificationThreads,
    language,
    unit,
    displayMode,
    network,
  } = state;

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{getPageTitle(I18n.t('containers.settings.title'))}</title>
      </Helmet>
      <SettingsTabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='content'>
        {/* NOTE: Do not remove, for future purpose */}
        {/* <SettingsTab
        launchAtLogin={launchAtLogin!}
        minimizedAtLaunch={minimizedAtLaunch!}
        language={language!}
        unit={unit!}
        displayMode={displayMode!}
        handleDropDowns={this.handleDropDowns}
        handleToggles={this.handleToggles}
      /> */}
        <TabContent activeTab={state.activeTab}>
          <SettingsTabGeneral
            launchAtLogin={launchAtLogin!}
            minimizedAtLaunch={minimizedAtLaunch!}
            pruneBlockStorage={pruneBlockStorage!}
            blockStorage={blockStorage!}
            databaseCache={databaseCache!}
            maximumAmount={maximumAmount!}
            maximumCount={maximumCount!}
            feeRate={feeRate!}
            scriptVerificationThreads={scriptVerificationThreads!}
            reindexAfterSaving={reindexAfterSaving!}
            handleRegularNumInputs={handleRegularNumInputs}
            handleFractionalInputs={handleFractionalNumInputs}
            handleToggles={handleToggles}
            network={network!}
            handleDropDowns={handleDropDowns}
            handeReindexToggle={handeReindexToggle}
          />
          <SettingsTabDisplay
            language={language!}
            unit={unit!}
            displayMode={displayMode!}
            handleDropDowns={handleDropDowns}
          />
        </TabContent>
      </div>
      <SettingsTabsFooter
        isUnsavedChanges={isUnsavedChanges || reindexAfterSaving}
        saveChanges={saveChanges}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    isFetching,
    settingsError,
    appConfig,
    isUpdating,
    isUpdated,
  } = state.settings;
  const { isRestart } = state.popover;
  const { locale } = state.i18n;
  return {
    isFetching,
    settingsError,
    appConfig,
    isUpdating,
    isUpdated,
    locale,
    isRestart,
  };
};

const mapDispatchToProps = {
  getSettingOptionsRequest,
  getInitialSettingsRequest,
  updateSettings: (settings) => updateSettingsRequest(settings),
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
