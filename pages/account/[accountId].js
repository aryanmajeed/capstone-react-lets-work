import Profile from "../../components/Profile/Profile";
import IdeaCard from "../../components/Account/IdeaCard";
import {
  Box,
  Stack,
  SimpleGrid,
  Center,
  Skeleton,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { auth } from "../../firebase/firebase";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { getUserProfileData } from "../../store/user/userSlice";
import { useSelector } from "react-redux";
import { usePopulateUserSlice } from "../../components/Hooks/usePopulateUserSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function AccountId({ params }) {
  const { t } = useTranslation("profile");

  const router = useRouter();

  const userInfo = useSelector((state) => state.user.entities);
  const loading = useSelector((state) => state.user.loading);
  usePopulateUserSlice(getUserProfileData, params.accountId);

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/");
    }
  }, [router]);

  const dummy_data = [
    {
      date: "12 hours ago",
      ideaImage: "https://source.unsplash.com/random",
      title: "German telescope",
      userImage: "https://source.unsplash.com/random",
      username: "Bruce Lee",
      id: 1,
    },
  ];
  return !auth.currentUser && params.accountId ? (
    <Skeleton h="100%" size="100%" />
  ) : (
    <Box dir={router.locale === "ar" ? "rtl" : "ltr"}>
      <Profile userInfo={userInfo} loading={loading} />
      <Box px={["50px", "100px", "150px"]}>
        <Heading
          paddingBottom="20px"
          fontSize={{ base: "25px", md: "27px" }}
          py="10"
        >
          {t("projects")}
        </Heading>
      </Box>

      <Stack
        bg="secondary.main"
        py={{ base: 8, md: 16 }}
        px={8}
        textAlign="center"
        dir="ltr"
      >
        <Center>
          <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={16}>
              {dummy_data.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  date={idea.date}
                  ideaImage={idea.ideaImage}
                  title={idea.title}
                  userImage={idea.userImage}
                  username={idea.username}
                  ideaId={idea.id}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Center>
      </Stack>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const params = context.params;
  return {
    props: {
      params,
      ...(await serverSideTranslations(context.locale, ["navbar", "profile"])),
    },
  };
}
