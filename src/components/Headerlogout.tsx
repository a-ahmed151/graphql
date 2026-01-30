import { Button } from "./ui/button";

export const HeaderLogout = ({logoutHandler,...props}: {logoutHandler:() => void}) => {
  return (
    <header>
      Header Component
      <Button onClick={logoutHandler}>Logout</Button>
    </header>
  );
};
