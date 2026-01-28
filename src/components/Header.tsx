import { Button } from "./ui/button";

export const Header = ({logoutHandler,...props}: {logoutHandler:() => void}) => {
  return (
    <header>
      Header Component
      <Button onClick={logoutHandler}>Logout</Button>
    </header>
  );
};
