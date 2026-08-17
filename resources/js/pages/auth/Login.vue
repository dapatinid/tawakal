<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/vue3';
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next';import { Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'


defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const showPassword = ref(false)

localStorage.setItem("just_logged_in", "true");
</script>

<template>

      <!-- Back Button -->
      <a href="/" class="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"><ArrowLeft class="size-4" /></a>

    <AuthBase
        title="Masuk untuk akses ke akun Anda"
        description="Isikan Email dan Password dengan benar"
    >
        <Head title="Log in" />

        <div
            v-if="status"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            {{ status }}
        </div>

        <Form
            v-bind="store.form()"
            :reset-on-success="['password']"
            v-slot="{ errors, processing }"
            class="flex flex-col gap-6"
        >
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="email"
                        placeholder="email@example.com"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        <TextLink
                            v-if="canResetPassword"
                            :href="request()"
                            class="text-sm"
                            :tabindex="5"
                        >
                            Forgot password?
                        </TextLink>
                    </div>

                    <div class="relative">
                        <Input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            name="password"
                            required
                            :tabindex="2"
                            autocomplete="current-password"
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

                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" :tabindex="3" />
                        <span>Remember me</span>
                    </Label>
                </div>

                <Button
                    type="submit"
                    class="mt-4 w-full"
                    :tabindex="4"
                    :disabled="processing"
                    data-test="login-button"
                >
                    <LoaderCircle
                        v-if="processing"
                        class="h-4 w-4 animate-spin"
                    />
                    Masuk
                </Button>
            </div>

            <!-- <div class="text-center text-sm text-muted-foreground">
                Belum punya akun?
                <TextLink :href="register()" :tabindex="5">Daftar di sini</TextLink>
            </div> -->
            <!-- <div class="text-center text-sm">                
                <TextLink :href="'/welcome'" :tabindex="6" > <span class="text-blue-500">TENTANG KAMI</span></TextLink>
            </div> -->
        </Form>
    </AuthBase>
</template>
