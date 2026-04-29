"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar as MuiAppBar,
  type AppBarProps as MuiAppBarProps,
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, type Theme, type CSSObject, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Logo } from "@/components/logo";
import { AuthButton } from "@/components/auth-button";

const drawerWidth = 240;

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Bookmarks", href: "/dashboard", icon: <BookmarkIcon /> },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

type AppShellProps = {
  user: { email?: string | null };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = isMobile ? mobileOpen : desktopOpen;

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setDesktopOpen((prev) => !prev);
    }
  };

  const drawerContent = (
    <>
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mr: "auto",
            pl: 1,
            opacity: open ? 1 : 0,
            transition: theme.transitions.create("opacity"),
          }}
        >
          <Logo size={28} />
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
            Smart Bookmark
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleToggle} aria-label="collapse sidebar">
            <ChevronLeftIcon
              sx={{
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
                transition: theme.transitions.create("transform"),
              }}
            />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />
      <List>
        {navItems.map((item) => {
          const selected = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ display: "block" }}>
              <Tooltip title={open ? "" : item.label} placement="right">
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={selected}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box
        component="footer"
        sx={{
          p: 2,
          textAlign: "center",
          fontSize: 12,
          color: "text.secondary",
          opacity: open ? 1 : 0,
          transition: theme.transitions.create("opacity"),
        }}
      >
        <Typography variant="caption" sx={{ display: "block" }}>
          Smart Bookmark
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Developed by{" "}
          <Box
            component="a"
            href="https://niragi-masalia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "primary.main", textDecoration: "none" }}
          >
            Niragi
          </Box>
        </Typography>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <CssBaseline />
      <AppBar position="fixed" open={!isMobile && desktopOpen} color="default" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Logo size={28} />
            <Typography
              variant="h6"
              component="div"
              noWrap
              sx={{ fontWeight: 700 }}
            >
              Smart Bookmark
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user.email && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "inline" } }}
                noWrap
              >
                {user.email}
              </Typography>
            )}
            <AuthButton mode="sign-out" />
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <Drawer
          variant="permanent"
          open={desktopOpen}
          sx={{
            "& .MuiDrawer-paper": {
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
