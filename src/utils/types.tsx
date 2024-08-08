export interface _Object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface FormType {
  name?: string
  rightText?: string
  leftText?: string
  type?: string
  icon?: string
  label?: string
  error?: string | false | undefined
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  isDisabled?: boolean
}

export interface TaxonomyConfig {
  taxonomy: string;
  filterKey: string;
}

export interface RootState {
  session: {
    isUserLoggedIn: boolean;
    loggedInUser: _Object;
    userWishlist: _Object
  };
}

export type LayoutProps = {
  footer: FooterProps
};

export type FooterProps = {
  menus: Navigation[];
};

export interface Navigation {
  id: string;
  name: string;
  menuItems: {
    nodes: _Object;
  }
}