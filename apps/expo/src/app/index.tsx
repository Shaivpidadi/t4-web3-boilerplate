import React, { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack, useRouter } from "expo-router";
import { LegendList } from "@legendapp/list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/expo";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", borderRadius: 8, backgroundColor: "#f3f4f6", padding: 16 }}>
      <View style={{ flex: 1 }}>
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: props.post.id },
          }}
        >
          <Pressable>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#3b82f6" }}>
              {props.post.title}
            </Text>
            <Text style={{ marginTop: 8, color: "#374151" }}>{props.post.content}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3b82f6" }}>Delete</Text>
      </Pressable>
    </View>
  );
}

function CreatePost() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate, error } = useMutation(
    trpc.post.create.mutationOptions({
      async onSuccess() {
        setTitle("");
        setContent("");
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    }),
  );

  return (
    <View style={{ marginTop: 16, gap: 8 }}>
      <TextInput
        style={{
          alignItems: "center",
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "#ffffff",
          paddingHorizontal: 12,
          fontSize: 18,
          lineHeight: 22.5,
          color: "#374151"
        }}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text style={{ marginBottom: 8, color: "#dc2626" }}>
          {error.data.zodError.fieldErrors.title}
        </Text>
      )}
      <TextInput
        style={{
          alignItems: "center",
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "#ffffff",
          paddingHorizontal: 12,
          fontSize: 18,
          lineHeight: 22.5,
          color: "#374151"
        }}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text style={{ marginBottom: 8, color: "#dc2626" }}>
          {error.data.zodError.fieldErrors.content}
        </Text>
      )}
      <Pressable
        style={{
          alignItems: "center",
          borderRadius: 6,
          backgroundColor: "#3b82f6",
          padding: 8
        }}
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}
      >
        <Text style={{ color: "#ffffff" }}>Create</Text>
      </Pressable>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text style={{ marginTop: 8, color: "#dc2626" }}>
          You need to be logged in to create a post
        </Text>
      )}
    </View>
  );
}

function MobileAuth() {
  const { user } = usePrivy();
  const router = useRouter();

  if (!user) {
    return (
      <View style={{ alignItems: "center", gap: 16 }}>
        <Text style={{ paddingBottom: 8, textAlign: "center", fontSize: 20, fontWeight: "600", color: "#18181b" }}>
          Not logged in
        </Text>
        <Button
          onPress={() => router.push("/login")}
          title="Sign In"
          color={"#5B65E9"}
        />
      </View>
    );
  }

  return (
    <View style={{ alignItems: "center", gap: 16 }}>
      <Text style={{ paddingBottom: 8, textAlign: "center", fontSize: 20, fontWeight: "600", color: "#18181b" }}>
        Hello, {user.id}!
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          onPress={() => router.push("/profile")}
          title="Profile"
          color={"#007AFF"}
        />
        <Button
          onPress={() => router.push("/login")}
          title="Switch Account"
          color={"#5B65E9"}
        />
      </View>
    </View>
  );
}

export default function Index() {
  const queryClient = useQueryClient();

  const postQuery = useQuery(trpc.post.all.queryOptions());

  const deletePostMutation = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries(trpc.post.all.queryFilter()),
    }),
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff" }}>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View style={{ height: "100%", width: "100%", backgroundColor: "#ffffff", padding: 16 }}>
        <Text style={{ paddingBottom: 8, textAlign: "center", fontSize: 48, fontWeight: "bold", color: "#374151" }}>
          Create <Text style={{ color: "#3b82f6" }}>T3</Text> Turbo
        </Text>

        <MobileAuth />

        <View style={{ paddingVertical: 8 }}>
          <Text style={{ fontWeight: "600", fontStyle: "italic", color: "#3b82f6" }}>
            Press on a post
          </Text>
        </View>

        <LegendList
          data={postQuery.data ?? []}
          estimatedItemSize={20}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={(p) => (
            <PostCard
              post={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />

        <CreatePost />
      </View>
    </SafeAreaView>
  );
}
