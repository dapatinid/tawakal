<script setup lang="ts">
import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/vue3';
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next';import { ref } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

</script>

<template>

      <!-- Back Button -->
      <a href="/login" class="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ArrowLeft class="size-4" /></a>

    <AuthBase
        title="Buat Akun Baru"
        description="Setelah tekan tombol daftar, hubungi admin segera (089684561000). Anda tidak bisa login tanpa aktivasi dari admin."
    >
        <Head title="Register" />

        <Form
            v-bind="RegisteredUserController.store.form()"
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
            class="flex flex-col gap-6"
        >
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="name"
                        name="name"
                        placeholder="Nama Lengkap"
                    />
                    <InputError :message="errors.name" />
                </div>
                <div class="grid gap-2">
                    <Label for="name">Whatsapp</Label>
                    <Input
                        id="phone"
                        type="text"
                        required
                        :tabindex="2"
                        autocomplete="phone"
                        name="phone"
                        placeholder="Contoh : 085950540055"
                    />
                    <InputError :message="errors.phone" />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        :tabindex="3"
                        autocomplete="email"
                        name="email"
                        placeholder="email@example.com"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Password</Label>

                    <div class="relative">
                        <Input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            :tabindex="4"
                            autocomplete="new-password"
                            name="password"
                            placeholder="Password"
                            class="pr-10"
                        />

                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            @click="showPassword = !showPassword"
                            tabindex="-1"
                        >
                            <Eye v-if="!showPassword" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </button>
                    </div>

                    <InputError :message="errors.password" />
                </div>


                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>

                    <div class="relative">
                        <Input
                            id="password_confirmation"
                            :type="showPasswordConfirmation ? 'text' : 'password'"
                            required
                            :tabindex="5"
                            autocomplete="new-password"
                            name="password_confirmation"
                            placeholder="Confirm password"
                            class="pr-10"
                        />

                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            @click="showPasswordConfirmation = !showPasswordConfirmation"
                            tabindex="-1"
                        >
                            <Eye v-if="!showPasswordConfirmation" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </button>
                    </div>

                    <InputError :message="errors.password_confirmation" />
                </div>


                <Button
                    type="submit"
                    class="mt-2 w-full"
                    tabindex="6"
                    :disabled="processing"
                    data-test="register-user-button"
                >
                    <LoaderCircle
                        v-if="processing"
                        class="h-4 w-4 animate-spin"
                    />
                    Daftar sekarang
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Sudah punya akun?
                <TextLink
                    :href="login()"
                    class="underline underline-offset-4"
                    :tabindex="7"
                    >Masuk di sini</TextLink
                >
            </div>
        </Form>
    </AuthBase>
</template>
