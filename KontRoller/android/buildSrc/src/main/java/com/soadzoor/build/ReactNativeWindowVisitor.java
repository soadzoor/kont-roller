package com.soadzoor.build;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import java.util.Set;

/** Replaces only RN 0.88's three window helpers; fails closed when their signatures change. */
public final class ReactNativeWindowVisitor extends ClassVisitor {
    private static final Set<String> METHODS = Set.of("enableEdgeToEdge", "statusBarHide", "statusBarShow");
    private static final String DESCRIPTOR = "(Landroid/view/Window;)V";
    private int replaced;
    public ReactNativeWindowVisitor(ClassVisitor next) { super(Opcodes.ASM9, next); }
    @Override public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        if (!METHODS.contains(name) || !DESCRIPTOR.equals(descriptor)) {
            return super.visitMethod(access, name, descriptor, signature, exceptions);
        }
        if ((access & Opcodes.ACC_STATIC) == 0) throw new IllegalStateException("React Native window helper is no longer static: " + name);
        MethodVisitor method = super.visitMethod(access, name, descriptor, signature, exceptions);
        method.visitCode();
        method.visitVarInsn(Opcodes.ALOAD, 0);
        method.visitMethodInsn(Opcodes.INVOKESTATIC, "com/soadzoor/kontroller/SystemBarsCompat", name, DESCRIPTOR, false);
        method.visitInsn(Opcodes.RETURN);
        method.visitMaxs(1, 1);
        method.visitEnd();
        replaced++;
        return null;
    }
    @Override public void visitEnd() {
        if (replaced != 3) throw new IllegalStateException("Expected three React Native 0.88 window helpers, found " + replaced + ". Review the compatibility fix before upgrading React Native.");
        super.visitEnd();
    }
}
